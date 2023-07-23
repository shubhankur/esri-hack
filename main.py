#get the data from the user
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import joblib
import base64
from email.mime.text import MIMEText
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from requests import HTTPError

# Setting up email server
SCOPES = [
        "https://www.googleapis.com/auth/gmail.send"
    ]
flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
creds = flow.run_local_server(port=0)
service = build('gmail', 'v1', credentials=creds)

#Setting our App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

#Connecting to database
mongo_uri = "mongodb+srv://skumar45:Shubh1998@hackathon.6c1rwqx.mongodb.net/main?retryWrites=true&w=majority"
client = MongoClient(mongo_uri)
db = client.get_database()

#loading all collections
parameters_by_counties = db['parameters']
review_collection  = db["review"]
alerts_collection  = db["alerts"]
counties_collection =  db['counties_by_state']
subscriber_collection  = db["subscribers"]
projection = {"_id": 0}

model_filename = 'spam_detection_model.pkl'
vectorizer_filename = 'spam_detection_vectorizer.pkl'

loaded_model = joblib.load(model_filename)
loaded_vectorizer = joblib.load(vectorizer_filename)
@app.route('/suitability', methods=['POST'])
def get_data():
    # Get the request body as a JSON object and get parameters
    parameters = request.json
    first_param = parameters["first"]
    second_param = parameters["second"]
    third_param = parameters["third"]

    # Get the query parameter named 'state'
    state = request.args.get('state')

    
    #get counties for each state
    counties_list = getCounties(state)

    #get counties and parameters
    all_counties = list(parameters_by_counties.find({"county": {"$in": counties_list}}))


    #get top 30% based on the first parameter
    first_param_list = []
    for county in all_counties:
        first_param_list.append(county[first_param])
    
    first_param_list.sort(reverse=True)

    top_30_percent_index = int(len(first_param_list)*0.3)
    #range of values for the second parameter
    lowest = first_param_list[top_30_percent_index]

    #gettin the counties based on the range of second parameter
    top_first_counties=[]
    for county in all_counties:
        if(county[first_param]>=lowest):
            top_first_counties.append(county)

    # top_first_counties = parameters_by_counties.find().sort(first_param, -1).limit(top_20_percent)

    if(second_param == ""):
        return jsonify({'result': top_first_counties}), 200

    #get top 50% based on the second parameter
    second_param_list = []
    for county in top_first_counties:
        second_param_list.append(county[second_param])
    
    second_param_list.sort(reverse=True)

    top_50_percent_index = len(second_param_list) // 2
    #range of values for the second parameter
    lowest = second_param_list[top_50_percent_index]

    #gettin the counties based on the range of second parameter
    top_second_counties=[]
    for county in top_first_counties:
        if(county[second_param]>=lowest):
            top_second_counties.append(county)
    
    if(third_param == ""):
        return jsonify({'result': top_second_counties}), 200
    
    #get top 80% based on the third param
    third_param_list = []
    for county in top_second_counties:
        third_param_list.append(county[third_param])
    
    third_param_list.sort(reverse=True)

    top_80_percent_index = int(len(third_param_list) * 0.8)
    #range of values for the second parameter
    lowest = third_param_list[top_80_percent_index]

    #gettin the counties based on the range of second parameter
    top_third_counties=[]
    for county in top_second_counties:
        if(county[third_param]>=lowest):
            top_third_counties.append(county)
    
    counties = []
    for i_county in top_third_counties:
        county={}
        county["name"] = i_county["county"]
        county["FIPS"] = i_county["FIPS"]
        counties.append(county)
    
    return counties, 200

def getCounties(state):
    county_list = counties_collection.find_one({"state":state})
    county_list =  county_list.get('counties',[])
    for i in range(len(county_list)):
        county_list[i] += " County"
    return county_list

@app.route('/review', methods=['POST'])
def post_review():
    parameters = request.json
    county = request.args.get('county')
    rating = parameters['rating']
    review = parameters['review']
    if(detectSpam(review)=='spam'):
        return jsonify({'result': "Your alert seems to be a spam"}), 400
    review_doc = {
            'county': county,
            'rating': rating,
            'review': review
    }
    review_collection.insert_one(review_doc)
    return jsonify({'result': "success"})

@app.route('/alert', methods=['POST'])
def post_alert():
    parameters = request.json
    county = request.args.get('county')
    level = parameters['level']
    details = parameters['details']
    if(detectSpam(details)=='spam'):
        return jsonify({'result': "Your alert seems to be a spam"}), 400
    alerts_doc = {
            'county': county,
            'level': level,
            'details': details,
    }
    alerts_collection.insert_one(alerts_doc)

    subscribers = list(subscriber_collection.find({"county":county}))
    for subs in subscribers:
        send_email_gmail(alerts_doc, subs['email'])
    return jsonify({'result': "success"}), 200

def send_email_gmail(alert, to):
    level = alert['level']
    county = alert['county']
    msg = (alert['details'])
    subject = f'{level} Alert on {county}'
    message = MIMEText(msg)
    message['to'] = to
    message['subject'] = subject
    create_message = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
    try:
        message = (service.users().messages().send(userId="me", body=create_message).execute())
        print(F'sent message to {message} Message Id: {message["id"]}')
    except HTTPError as error:
        print(F'An error occurred: {error}')

@app.route('/subscribe', methods=['POST'])
def post_subscribers():
    parameters = request.json
    county = request.args.get('county')
    name = parameters['name']
    email = parameters['email']
    subscriber_doc = {
            'county': county,
            'name':name,
            'email':email
    }
    subscriber_collection.insert_one(subscriber_doc)
    return jsonify({'result': "success"})


@app.route('/county/<name>', methods=['GET'])
def get_county_details(name):
    # county_name = name
    county = {}
    fetched_county_params = parameters_by_counties.find_one({"county":name})
    county_name = fetched_county_params['county']
    county['safety'] = fetched_county_params['safety']
    county['transit'] = fetched_county_params['transit']
    county['hospital'] = fetched_county_params['hospital']
    reviews = list(review_collection.find({"county":county_name}, projection))
    county['reviews'] = reviews
    alerts = list(alerts_collection.find({"county":county_name}, projection))
    county['alerts'] = alerts
    return jsonify({'result': county}), 200

@app.route('/getAllCounties/<state>', methods = ['GET'])
def get_all_counties(state):
    counties = getCounties(state)
    return counties, 200

def detectSpam(text):
    text = loaded_vectorizer.transform([text])
    prediction = loaded_model.predict(text)
    return prediction[0]


if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
from pymongo import MongoClient
import json
import csv

app = Flask(__name__)

mongo_uri = "mongodb+srv://skumar45:Shubh1998@hackathon.6c1rwqx.mongodb.net/main?retryWrites=true&w=majority"
client = MongoClient(mongo_uri)
db = client.get_database()


def push_counties_by_state(collection_name, file_path):
    counties_by_state = {}
    with open(file_path, 'r') as counties_json:
        counties_by_state = json.load(counties_json)
    
    collection  = db[collection_name]
    for state, counties in counties_by_state.items():
        location_doc = {
            'state': state,
            'counties': counties
        }
        collection.insert_one(location_doc)

def push_counties_parameters(collection_name, file_path):
    counties_by_state = {}
    collection  = db[collection_name]
    list_doc=[]
    with open(file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            doc={}
            safety = float(row['Homicide'])
            hospital = float(row['Hospital'])
            transit = float(row['Transit'])
            county = row['\ufeffNAME']
            doc['county'] = county
            doc['safety']=safety
            doc['hospital']=hospital
            doc['transit']=transit
            list_doc.append(doc)
    collection.insert_many(list_doc)

def push_fipo_for_california():
    collection = db['parameters']
    with open("data/texas_parameters.csv", 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            county = collection.find_one({'county':row['\ufeffNAME']})
            county["FIPS"] = row['FIPS']
            collection.replace_one({'county':row['\ufeffNAME']},county)


push_fipo_for_california()

# push_counties_parameters('parameters','data/texas_parameters.csv')

# push_counties_by_state('counties_by_state','data/cleaned_data/counties.json')
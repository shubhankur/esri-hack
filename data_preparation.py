import csv
import json
def getCounties(input_file_path, output_file_path):
    with open(input_file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
    # The csv_reader object is an iterator. You can loop through it to access each row in the CSV.
        counties = {}
        for row in csv_reader:
            state = row['State']
            county = row['County']
            if state in counties:
                counties[state].append(county)
            else:
                counties[state] = [county]

        with open(output_file_path, 'w') as json_file:
            json.dump(counties, json_file)


getCounties("data/list_of_counties_in_united_states-436j.csv", "data/cleaned_data/counties.json")

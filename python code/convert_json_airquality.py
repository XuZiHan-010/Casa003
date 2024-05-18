import pandas as pd
import json

# Assuming the CSV file has columns named 'name', '2014', '2017', '2021'
# Load data from a CSV file
df = pd.read_csv('water_quality.csv')

# Function to convert DataFrame to the required JSON format
def convert_to_json(df):
    result = []
    for _, row in df.iterrows():
        entry = {
            "name": row["name"],
            "pm25": {
                "2014": row["2014"],
                "2017": row["2017"],
                "2021": row["2021"]
            }
        }
        result.append(entry)
    return result

# Convert the DataFrame to JSON
json_output = convert_to_json(df)

# Write output to a JSON file
with open('water_quality.json', 'w') as json_file:
    json.dump(json_output, json_file, indent=4)

print("JSON file has been written.")

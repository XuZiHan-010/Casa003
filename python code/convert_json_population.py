import pandas as pd
import json

# Load the CSV file
file_path = 'Airquality_Percentile.csv'
#replace the file_path with the actual path of the file on your pc
data = pd.read_csv(file_path)

# Convert all float values to integers
for column in data.columns:
    if data[column].dtype == float:
        data[column] = data[column].apply(lambda x: int(x) if pd.notnull(x) else x)

# Convert the DataFrame to the desired JSON format after renaming the column for clarity
result_json = data.rename(columns={'City': 'Name'}).to_dict(orient='records')

# Save the JSON to a file
with open('Airquality_Percentile.json', 'w') as f:
    json.dump(result_json, f, indent=4)

# Print the first few entries to verify
print(json.dumps(result_json[:5], indent=4))

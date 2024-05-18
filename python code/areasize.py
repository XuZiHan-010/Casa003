import json
from shapely.geometry import shape
from shapely.ops import transform
import pyproj

# Function to convert latitude/longitude to square kilometers and then to square miles
def project_to_square_miles(geom):
    # Define a projection that computes area in square kilometers
    proj = pyproj.Transformer.from_crs(
        'EPSG:4326', 'EPSG:6933', always_xy=True)  # EPSG:6933 for meter-based area calculation
    area_sq_km = transform(proj.transform, geom).area / 1e6  # Convert sq meters to sq kilometers
    return area_sq_km * 0.386102  # Convert sq kilometers to sq miles

# Load GeoJSON data from a file
def load_geojson(path):
    with open(path, 'r') as file:
        return json.load(file)

# Load population data from a file
def load_population_data(path):
    with open(path, 'r') as file:
        return json.load(file)

# Main function to calculate areas and densities in square miles
def calculate_densities(geojson_path, population_path):
    # Load data
    geojson_data = load_geojson(geojson_path)
    population_data = load_population_data(population_path)

    # Prepare data structures
    area_sq_miles = {}

    # Calculate areas in square miles
    for feature in geojson_data["features"]:
        geom = shape(feature["geometry"])
        area_miles = project_to_square_miles(geom)
        area_sq_miles[feature["properties"]["name"].lower()] = area_miles

    # Calculate population density and update population data
    for data in population_data:
        name = data["Name"].lower()
        if name in area_sq_miles:
            area = area_sq_miles[name]
            for year in ["2010", "2015", "2020", "2022"]:
                density = int(data[year] / area) if area else 0
                data[year] = density  # Replace the original population number with density

    return population_data

# Set file paths
geojson_path = 'los_angeles.geojson'
population_path = 'la_population_data.json'

# Calculate densities
updated_population_data = calculate_densities(geojson_path, population_path)

# Write the updated data to a new JSON file
def write_data_to_file(data, filename):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

# Output filename
output_filename = 'la_population_density_per_sq_mile.json'

# Write data to file
write_data_to_file(updated_population_data, output_filename)
print(f"Updated population density data per square mile has been written to {output_filename}.")

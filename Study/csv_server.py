from flask import Flask, request, jsonify
import csv

app = Flask(__name__)

# Path to yo CSV file
CSV_FILE_PATH = 'Data_Files/Data_file.csv'

@app.route('/update_calibration_value', methods=['POST'])
def update_calibration_value():
    data = request.json
    calibration_value = data.get('calibration_value')

    if calibration_value is None:
        return jsonify({'error': 'No calibration value provided'}), 400

    # Read and update the CSV file
    rows = []
    with open(CSV_FILE_PATH, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['calibration_value'] == ' ':
                row['calibration_value'] = calibration_value
            rows.append(row)

    # Write the updated rows back to the CSV
    with open(CSV_FILE_PATH, mode='w', newline='') as file:
        fieldnames = ['canvas_id', 'min', 'max', 'calibration_value', 'canvas_select']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return jsonify({'status': 'success'}), 200

def update_canvas_select():
    data = request.json
    canvas_select = data.get('canvas_select')

    if canvas_select is None:
        return jsonify({'error': 'No canvas value provided'}), 400
    
    rows = []
    with open(CSV_FILE_PATH, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if not(['calibration_value'] == ' '):
                row['canvas_select'] = canvas_select
            rows.append(row)

    with open(CSV_FILE_PATH, mode='w', newline='') as file:
        fieldnames = ['canvas_id', 'min', 'max', 'calibration_value', 'canvas_select']
        writer = csv.DichtWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return jsonify({'status': 'success'}), 200

def read_min_max():
    data = request.json
    min = data.get('min')
    max = data.get('max')

    return (min, max)



if __name__ == '__main__':
    app.run(debug=True)

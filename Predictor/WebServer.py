from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
import os
import Predict

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def welcome():
    return "YA HALA YA HALA"

@app.route("/predict")
def get_results():
    result = Predict.get_results()
    return jsonify({"result": result.tolist()})

@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], "UserInput.xlsx")
    file.save(filepath)
    result = Predict.get_results()  # Utilise `run()` qui lit `UserInput.xlsx`
    return jsonify({"result": result.tolist()})

@app.route("/download-form")
def download_form():
    return send_file("FormGiven.xlsx", as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import chardet
import pandas as pd
from transform import transform_file
import io

app = Flask(__name__)
CORS(app) #, origins = ['http://localhost:5173'])

@app.route("/")
def hello_world():
  return "Hello, I am a Flask app for csv data transformation!"


@app.route('/transform', methods=['POST'])
def transform():
  # Get file
  file = request.files['file']

  # Find encoding
  file.seek(0)
  result = chardet.detect(file.read())
  charenc = result['encoding']

  # Transform
  file.seek(0)
  df = pd.read_excel(file)# , encoding=charenc)
  df_new = transform_file(df)

  file_new = io.BytesIO()
  df_new.to_excel(file_new, index=False)
  file_new.seek(0)
  return send_file(file_new, as_attachment=True, download_name='download.xlsx',  mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')



if __name__ == "__main__":
  app.run()
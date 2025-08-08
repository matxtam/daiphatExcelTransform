from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
# import chardet
import pandas as pd
from transform import transform_file, export_excel_beautifully
import io
import os

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
  # file.seek(0)
  # result = chardet.detect(file.read())
  # charenc = result['encoding']

  # Transform
  file.seek(0)
  df = pd.read_excel(file, dtype=str)# , encoding=charenc)
  if df is None:
    return jsonify({'error': 'Invalid file format'}, 400)

  df_new = transform_file(df, keep_product_name=True)
  if df_new is None:
    return jsonify({'error': 'Invalid file format'}, 400)

  file_new = io.BytesIO()
  # df_new.to_excel(file_new, index=False)
  export_excel_beautifully(df_new, file_new)

  file_new.seek(0)
  return send_file(file_new, as_attachment=True, download_name='download.xlsx',  mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')



if __name__ == "__main__":
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=False)
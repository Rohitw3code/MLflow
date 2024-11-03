from flask import Flask
from flask_cors import CORS
from routes.api_routes import api
from routes.preprocessing_routes import preprocessing
from routes.model_routes import model_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(preprocessing, url_prefix='/api/preprocess')
app.register_blueprint(model_routes, url_prefix='/api/model')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
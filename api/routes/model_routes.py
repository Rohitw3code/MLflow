from flask import Blueprint, request, jsonify
from controllers.model_controller import ModelController

model_routes = Blueprint('model', __name__)
controller = ModelController()

@model_routes.route('/init', methods=['POST'])
def init_model():
    data = request.get_json()
    algorithm = data.get('algorithm')
    model_type = data.get('model_type')
    params = data.get('params', {})
    
    if not algorithm or not model_type:
        return jsonify({
            'error': 'Algorithm and model_type are required'
        }), 400
        
    return controller.initialize_model(algorithm, model_type, params)

@model_routes.route('/train', methods=['POST'])
def train_model():
    data = request.get_json()
    X_train = data.get('X_train')
    y_train = data.get('y_train')
    
    if not X_train or not y_train:
        return jsonify({
            'error': 'Training data (X_train and y_train) are required'
        }), 400
        
    return controller.train_model(X_train, y_train)

@model_routes.route('/evaluate', methods=['POST'])
def evaluate_model():
    data = request.get_json()
    X_test = data.get('X_test')
    y_test = data.get('y_test')
    
    if not X_test or not y_test:
        return jsonify({
            'error': 'Test data (X_test and y_test) are required'
        }), 400
        
    return controller.evaluate_model(X_test, y_test)

@model_routes.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = data.get('features')
    
    if not features:
        return jsonify({'error': 'Features are required'}), 400
        
    return controller.make_prediction(features)
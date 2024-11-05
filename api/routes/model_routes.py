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
    X_train = data.get('X_train', [])
    y_train = data.get('y_train', [])
    features = data.get('features', [])
    
    print("Model Train route : ",features)

    if not X_train or not y_train or not features:
        return jsonify({
            'error': 'Training data (X_train, y_train) and features are required'
        }), 400
    
    # Convert list of dictionaries to feature matrix
    X_train_matrix = [[row[feature] for feature in features] for row in X_train]
        
    return controller.train_model(X_train_matrix, y_train)

@model_routes.route('/evaluate', methods=['POST'])
def evaluate_model():
    data = request.get_json()
    X_test = data.get('X_test', [])
    y_test = data.get('y_test', [])
    features = data.get('features', [])
    
    if not X_test or not y_test or not features:
        return jsonify({
            'error': 'Test data (X_test, y_test) and features are required'
        }), 400
        
    # Convert list of dictionaries to feature matrix
    X_test_matrix = [[row[feature] for feature in features] for row in X_test]
        
    return controller.evaluate_model(X_test_matrix, y_test)

@model_routes.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features_data = data.get('features', [])
    feature_names = data.get('feature_names', [])
    
    if not features_data or not feature_names:
        return jsonify({'error': 'Features and feature names are required'}), 400
        
    # Convert list of dictionaries to feature matrix if needed
    if isinstance(features_data[0], dict):
        features_matrix = [[row[feature] for feature in feature_names] for row in features_data]
    else:
        features_matrix = features_data
        
    return controller.make_prediction(features_matrix)
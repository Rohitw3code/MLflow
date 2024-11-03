from flask import Blueprint, request, jsonify
from controllers.preprocessing_controller import PreprocessingController

preprocessing = Blueprint('preprocessing', __name__)
preprocessing.dataset = None  # Will be set by app.py

@preprocessing.route('/missing', methods=['POST'])
def handle_missing():
    data = request.get_json()
    column = data.get('column')
    method = data.get('method', 'mean')  # mean, median, mode, remove
    if not column:
        return jsonify({'error': 'Column name is required'}), 400
        
    controller = PreprocessingController(preprocessing.dataset)
    return controller.handle_missing(column, method)

@preprocessing.route('/delete-column', methods=['POST'])
def delete_column():
    data = request.get_json()
    column = data.get('column')
    if not column:
        return jsonify({'error': 'Column name is required'}), 400
        
    controller = PreprocessingController(preprocessing.dataset)
    return controller.remove_column(column)

@preprocessing.route('/get-columns', methods=['GET'])
def get_columns():
    column1 = request.args.get('column1')
    column2 = request.args.get('column2')
    if not column1:
        return jsonify({'error': 'At least one column name is required'}), 400
        
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_columns_data(column1, column2)

@preprocessing.route('/encode', methods=['POST'])
def encode_column():
    data = request.get_json()
    column = data.get('column')
    method = data.get('method', 'label')  # label or onehot
    if not column:
        return jsonify({'error': 'Column name is required'}), 400
        
    controller = PreprocessingController(preprocessing.dataset)
    return controller.encode_column(column, method)

@preprocessing.route('/scale', methods=['POST'])
def scale_features():
    data = request.get_json()
    columns = data.get('columns', [])
    method = data.get('method', 'standard')  # standard or minmax
    if not columns:
        return jsonify({'error': 'Columns list is required'}), 400
        
    controller = PreprocessingController(preprocessing.dataset)
    return controller.scale_columns(columns, method)

@preprocessing.route('/features-target', methods=['POST'])
def get_features_target():
    data = request.get_json()
    features = data.get('features', [])
    target = data.get('target')
    if not features or not target:
        return jsonify({'error': 'Features and target are required'}), 400
        
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_features_and_target(features, target)

@preprocessing.route('/split', methods=['POST'])
def split_data():
    data = request.get_json()
    features = data.get('features', [])
    target = data.get('target')
    test_size = float(data.get('test_size', 0.2))
    random_state = int(data.get('random_state', 42))
    shuffle = bool(data.get('shuffle', True))
    
    if not features or not target:
        return jsonify({'error': 'Features and target are required'}), 400
    
    controller = PreprocessingController(preprocessing.dataset)
    return controller.split_dataset(features, target, test_size, random_state, shuffle)
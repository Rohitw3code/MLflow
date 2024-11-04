from flask import Blueprint, request, jsonify
from controllers.preprocessing_controller import PreprocessingController

preprocessing = Blueprint('preprocessing', __name__)
preprocessing.dataset = None  # Will be set by app.py

@preprocessing.route('/head', methods=['GET'])
def get_head():
    n = request.args.get('n', default=5, type=int)
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_head_data(n)

@preprocessing.route('/tail', methods=['GET'])
def get_tail():
    n = request.args.get('n', default=5, type=int)
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_tail_data(n)

@preprocessing.route('/shape', methods=['GET'])
def get_shape():
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_shape_data()

@preprocessing.route('/missing', methods=['GET'])
def get_missing_values():
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_missing_values()

@preprocessing.route('/column-types', methods=['GET'])
def get_column_types():
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_column_types()

# @preprocessing.route('/update-type', methods=['GET'])
# def get_column_types():
#     data = request.get_json()
#     column = data.get('column')
#     dtype = data.get('dtype')
#     if not column or not dtype:
#         return {'error': 'Column and dtype are required'}, 400    
#     controller = PreprocessingController(preprocessing.dataset)
#     return controller.update_column_type()


@preprocessing.route('/categorical-columns', methods=['GET'])
def get_categorical_columns():
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_categorical_columns()

@preprocessing.route('/numerical-columns', methods=['GET'])
def get_numerical_columns():
    controller = PreprocessingController(preprocessing.dataset)
    return controller.get_numerical_columns()

@preprocessing.route('/handle-missing-values', methods=['POST'])
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

@preprocessing.route('/split', methods=['POST'])
def split_dataset():
    data = request.get_json()
    test_size = float(data.get('test_size', 0.2))
    random_state = int(data.get('random_state', 42))
    shuffle = bool(data.get('shuffle', True))
    stratify = bool(data.get('stratify', False))
    
    controller = PreprocessingController(preprocessing.dataset)
    return controller.split_dataset(test_size, random_state, shuffle, stratify)
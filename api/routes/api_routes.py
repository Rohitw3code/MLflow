from flask import Blueprint, request
from controllers.data_controller import DataController

api = Blueprint('api', __name__)
controller = DataController()

@api.route('/load', methods=['POST'])
def load_data():
    return controller.initialize_data()

@api.route('/head', methods=['GET'])
def get_head():
    n = request.args.get('n', default=5, type=int)
    return controller.get_head_data(n)

@api.route('/tail', methods=['GET'])
def get_tail():
    n = request.args.get('n', default=5, type=int)
    return controller.get_tail_data(n)

@api.route('/shape', methods=['GET'])
def get_shape():
    return controller.get_shape_data()

@api.route('/describe', methods=['GET'])
def get_description():
    return controller.get_description_data()

@api.route('/info', methods=['GET'])
def get_info():
    return controller.get_info_data()

@api.route('/missing', methods=['GET'])
def get_missing_values():
    return controller.get_missing_values_data()

@api.route('/update-type', methods=['POST'])
def update_type():
    data = request.get_json()
    column = data.get('column')
    dtype = data.get('dtype')
    if not column or not dtype:
        return {'error': 'Column and dtype are required'}, 400
    return controller.update_column_type(column, dtype)

@api.route('/dataset', methods=['GET'])
def get_dataset():
    return controller.get_dataset()

@api.route('/column-types', methods=['GET'])
def get_column_types():
    return controller.get_column_types()
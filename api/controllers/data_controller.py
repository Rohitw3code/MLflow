from flask import jsonify
from models.dataset import Dataset

class DataController:
    def __init__(self):
        self.dataset = None
        
    def initialize_data(self):
        try:
            self.dataset.load_data()
            return jsonify({'message': 'Dataset loaded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_head_data(self, n=5):
        try:
            data = self.dataset.get_head(n)
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_tail_data(self, n=5):
        try:
            data = self.dataset.get_tail(n)
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_shape_data(self):
        try:
            shape = self.dataset.get_shape()
            return jsonify(shape), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_description_data(self):
        try:
            description = self.dataset.get_description()
            return jsonify(description), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_info_data(self):
        try:
            info = self.dataset.get_info()
            return jsonify(info), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_missing_values_data(self):
        try:
            missing = self.dataset.get_missing_values()
            return jsonify(missing), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def update_column_type(self, column, dtype):
        try:
            result = self.dataset.update_column_type(column, dtype)
            return jsonify(result), 200 if result['success'] else 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    def get_dataset(self):
        try:
            data = self.dataset.get_dataset()
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    def get_column_types(self):
        try:
            types = self.dataset.get_column_types()
            return jsonify(types), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    def get_visualization_data(self, x_column, y_column=None):
        try:
            result = self.dataset.get_visualization_data(x_column, y_column)
            if result['success']:
                return jsonify(result['data']), 200
            return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
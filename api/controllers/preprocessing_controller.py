from flask import jsonify
from models.preprocessing import DataPreprocessor
from models.dataset import Dataset

class PreprocessingController:
    def __init__(self, dataset):
        self.dataset = dataset
        self.preprocessor = DataPreprocessor(dataset.df)
    
    def handle_missing(self, column, method):
        try:
            result = self.preprocessor.handle_missing_values(column, method)
            # Update the dataset's DataFrame after preprocessing
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def remove_column(self, column):
        try:
            result = self.preprocessor.delete_column(column)
            # Update the dataset's DataFrame after preprocessing
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_columns_data(self, column1, column2=None):
        try:
            data = self.preprocessor.get_column_values(column1, column2)
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def encode_column(self, column, method):
        try:
            result = self.preprocessor.encode_categorical(column, method)
            # Update the dataset's DataFrame after preprocessing
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def scale_columns(self, columns, method):
        try:
            result = self.preprocessor.scale_features(columns, method)
            # Update the dataset's DataFrame after preprocessing
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_features_and_target(self, features, target):
        try:
            result = self.preprocessor.get_features_target(features, target)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def split_dataset(self, features, target, test_size, random_state, shuffle):
        try:
            result = self.preprocessor.split_data(
                features, target, test_size, random_state, shuffle
            )
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
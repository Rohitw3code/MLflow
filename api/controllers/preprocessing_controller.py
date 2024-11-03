from flask import jsonify
import pandas as pd
import numpy as np
from models.preprocessing import DataPreprocessor

class PreprocessingController:
    def __init__(self, dataset):
        self.dataset = dataset
        self.preprocessor = DataPreprocessor(dataset.df)
    
    def get_categorical_columns(self):
        try:
            categorical_columns = []
            for column in self.dataset.df.columns:
                if self.dataset.df[column].dtype == 'object' or pd.api.types.is_categorical_dtype(self.dataset.df[column]):
                    unique_values = len(self.dataset.df[column].unique())
                    categorical_columns.append({
                        'name': column,
                        'type': str(self.dataset.df[column].dtype),
                        'uniqueValues': unique_values
                    })
            return jsonify({'columns': categorical_columns}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_numerical_columns(self):
        try:
            numerical_columns = []
            for column in self.dataset.df.columns:
                if pd.api.types.is_numeric_dtype(self.dataset.df[column]):
                    numerical_columns.append({
                        'name': column,
                        'min': float(self.dataset.df[column].min()),
                        'max': float(self.dataset.df[column].max())
                    })
            return jsonify({'columns': numerical_columns}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def handle_missing(self, column, method):
        try:
            result = self.preprocessor.handle_missing_values(column, method)
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def remove_column(self, column):
        try:
            result = self.preprocessor.delete_column(column)
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
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def scale_columns(self, columns, method):
        try:
            result = self.preprocessor.scale_features(columns, method)
            self.dataset.df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def split_dataset(self, test_size, random_state, shuffle, stratify):
        try:
            result = self.preprocessor.split_data(
                test_size=test_size,
                random_state=random_state,
                shuffle=shuffle,
                stratify=stratify
            )
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
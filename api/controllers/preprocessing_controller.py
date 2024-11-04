from flask import jsonify
import pandas as pd
import numpy as np
from models.preprocessing import DataPreprocessor

class PreprocessingController:
    def __init__(self, dataset):
        self.dataset = dataset
        self.preprocessor = DataPreprocessor(dataset.preprocessed_df)
    
    def get_head_data(self, n=5):
        try:
            head_data = self.preprocessor.df.head(n)
            return jsonify({
                'columns': list(head_data.columns),
                'data': head_data.to_dict('records')
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_tail_data(self, n=5):
        try:
            tail_data = self.preprocessor.df.tail(n)
            return jsonify({
                'columns': list(tail_data.columns),
                'data': tail_data.to_dict('records')
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_shape_data(self):
        try:
            shape = self.preprocessor.df.shape
            return jsonify({
                'rows': int(shape[0]),
                'columns': int(shape[1])
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_missing_values(self):
        try:
            missing_data = self.preprocessor.df.isna().sum()
            return jsonify({
                'data': [
                    {
                        'column': str(col),
                        'missing_count': int(count)
                    }
                    for col, count in missing_data.items()
                ]
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_column_types(self):
        try:
            return jsonify({
                'columns': [
                    {
                        'name': str(col),
                        'current_type': str(self.preprocessor.df[col].dtype)
                    }
                    for col in self.preprocessor.df.columns
                ]
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    def update_column_type(self, column, dtype):
        try:
            result = self.preprocessor.update_column_type(column, dtype)
            self.dataset.preprocessed_df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

            
    def get_categorical_columns(self):
        try:
            categorical_columns = []
            for column in self.preprocessor.df.columns:
                if self.preprocessor.df[column].dtype == 'object' or pd.api.types.is_categorical_dtype(self.preprocessor.df[column]):
                    unique_values = len(self.preprocessor.df[column].unique())
                    categorical_columns.append({
                        'name': column,
                        'type': str(self.preprocessor.df[column].dtype),
                        'uniqueValues': unique_values
                    })
            return jsonify({'columns': categorical_columns}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_numerical_columns(self):
        try:
            numerical_columns = []
            for column in self.preprocessor.df.columns:
                if pd.api.types.is_numeric_dtype(self.preprocessor.df[column]):
                    numerical_columns.append({
                        'name': column,
                        'min': float(self.preprocessor.df[column].min()),
                        'max': float(self.preprocessor.df[column].max())
                    })
            return jsonify({'columns': numerical_columns}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def handle_missing(self, column, method):
        try:
            result = self.preprocessor.handle_missing_values(column, method)
            self.dataset.preprocessed_df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def remove_column(self, column):
        try:
            result = self.preprocessor.delete_column(column)
            self.dataset.preprocessed_df = self.preprocessor.df
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
            self.dataset.preprocessed_df = self.preprocessor.df
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def scale_columns(self, columns, method):
        try:
            result = self.preprocessor.scale_features(columns, method)
            self.dataset.preprocessed_df = self.preprocessor.df
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
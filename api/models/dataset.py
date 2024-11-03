import pandas as pd
import numpy as np
import os

class Dataset:
    def __init__(self):
        print(os.getcwd())
        self.df = pd.read_csv('api/data/sample.csv')
    
    def _convert_to_json_serializable(self, value):
        if pd.isna(value):
            return None
        if isinstance(value, (np.int64, np.int32, np.int16, np.int8)):
            return int(value)
        if isinstance(value, (np.float64, np.float32, np.float16)):
            return float(value)
        if isinstance(value, np.bool_):
            return bool(value)
        return value

    def _prepare_records(self, df):
        records = df.to_dict('records')
        return [{k: self._convert_to_json_serializable(v) for k, v in record.items()} 
                for record in records]
    
    def load_data(self, filename='api/data/sample.csv'):
        self.df = pd.read_csv(filename)
        return True
    
    def get_head(self, n=5):
        head_data = self.df.head(n)
        return {
            'columns': list(head_data.columns),
            'data': self._prepare_records(head_data)
        }
    
    def get_tail(self, n=5):
        tail_data = self.df.tail(n)
        return {
            'columns': list(tail_data.columns),
            'data': self._prepare_records(tail_data)
        }
    
    def get_shape(self):
        return {'rows': int(self.df.shape[0]), 'columns': int(self.df.shape[1])}
    
    def get_description(self):
        desc_data = self.df.describe()
        return {
            'columns': list(desc_data.columns),
            'data': self._prepare_records(desc_data),
            'index': list(desc_data.index)
        }
    
    def get_info(self):
        info_dict = {
            'columns': list(self.df.columns),
            'data': [
                {
                    'column': str(col),
                    'dtype': str(self.df[col].dtype),
                    'non_null_count': int(self.df[col].count()),
                    'memory_usage': int(self.df[col].memory_usage(deep=True))
                }
                for col in self.df.columns
            ]
        }
        return info_dict
    
    def get_missing_values(self):
        missing_data = self.df.isna().sum()
        return {
            'columns': list(missing_data.index),
            'data': [
                {
                    'column': str(col),
                    'missing_count': int(count)
                } 
                for col, count in missing_data.items()
            ]
        }
    
    def update_column_type(self, column, dtype):
        try:
            self.df[column] = self.df[column].astype(dtype)
            return {'message': f'Column {column} type updated to {dtype}', 'success': True}
        except Exception as e:
            return {'message': str(e), 'success': False}
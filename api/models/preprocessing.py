import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split

class DataPreprocessor:
    def __init__(self, df):
        self.df = df
        self.label_encoders = {}
        
    def handle_missing_values(self, column, method='mean'):
        print("col : ",column)
        print("method : ",method)
        print("df : ",self.df[column])
        if method == 'mean':
            value = self.df[column].mean()
        elif method == 'median':
            value = self.df[column].median()
        elif method == 'mode':
            value = self.df[column].mode()[0]
        elif method == 'remove':
            self.df.dropna(subset=[column], inplace=True)
            return {'message': f'Rows with NaN in {column} removed'}
        
        if method != 'remove':
            self.df[column].fillna(value, inplace=True)
        return {'message': f'Missing values in {column} handled using {method}'}
    
    def delete_column(self, column):
        if column in self.df.columns:
            self.df.drop(columns=[column], inplace=True)
            return {'message': f'Column {column} deleted successfully'}
        return {'error': f'Column {column} not found'}
    
    def get_column_values(self, column1, column2=None):
        if column2:
            return {
                'column1': self.df[column1].tolist(),
                'column2': self.df[column2].tolist()
            }
        return {'values': self.df[column1].tolist()}
    
    def encode_categorical(self, column, method='label'):
        if method == 'label':
            le = LabelEncoder()
            self.df[f'{column}_encoded'] = le.fit_transform(self.df[column])
            self.label_encoders[column] = le
            return {'message': f'Label encoding applied to {column}'}
        elif method == 'onehot':
            encoded = pd.get_dummies(self.df[column], prefix=column)
            self.df = pd.concat([self.df, encoded], axis=1)
            self.df.drop(columns=[column], inplace=True)
            return {'message': f'One-hot encoding applied to {column}'}
        return {'error': 'Invalid encoding method'}
    
    def scale_features(self, columns, method='standard'):
        if method == 'standard':
            scaler = StandardScaler()
        elif method == 'minmax':
            scaler = MinMaxScaler()
        else:
            return {'error': 'Invalid scaling method'}
            
        self.df[columns] = scaler.fit_transform(self.df[columns])
        return {'message': f'{method} scaling applied to {columns}'}
    
    def get_features_target(self, features, target):
        if not all(col in self.df.columns for col in features + [target]):
            return {'error': 'One or more columns not found'}
        
        X = self.df[features]
        y = self.df[target]
        return {
            'features': X.to_dict(orient='records'),
            'target': y.tolist()
        }
    
    def split_data(self, features, target, test_size=0.2, random_state=42, shuffle=True):
        X = self.df[features]
        y = self.df[target]
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, shuffle=shuffle
        )
        
        return {
            'X_train': X_train.to_dict(orient='records'),
            'X_test': X_test.to_dict(orient='records'),
            'y_train': y_train.tolist(),
            'y_test': y_test.tolist(),
            'train_size': len(X_train),
            'test_size': len(X_test)
        }
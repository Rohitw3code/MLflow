import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler, MinMaxScaler, RobustScaler, Normalizer, QuantileTransformer
from sklearn.model_selection import train_test_split


class DataPreprocessor:
    def __init__(self, df):
        self.df = df
        self.label_encoders = {}
        self.scalers = {}

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

    def missing_values(self, column):
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
            if dtype == 'int64':
                # First convert to float to handle any NaN values
                self.df[column] = pd.to_numeric(
                    self.df[column], errors='raise')
                # Then convert to int if all values are whole numbers
                if self.df[column].dropna().apply(float.is_integer).all():
                    self.df[column] = self.df[column].astype(
                        'Int64')  # nullable integer type
                else:
                    raise ValueError("Column contains non-integer values")
            elif dtype == 'float64':
                self.df[column] = pd.to_numeric(
                    self.df[column], errors='raise')
            elif dtype == 'datetime':
                self.df[column] = pd.to_datetime(
                    self.df[column], errors='raise')
            else:
                self.df[column] = self.df[column].astype(
                    dtype)

            return {
                'message': f'Column {column} type updated to {dtype}',
                'success': True,
                'new_type': str(self.df[column].dtype)
            }
        except ValueError as e:
            return {
                'message': f'Conversion error: {str(e)}',
                'success': False,
                'error_type': 'value_error'
            }
        except Exception as e:
            return {
                'message': f'Unexpected error: {str(e)}',
                'success': False,
                'error_type': 'general_error'
            }

    def handle_missing_values(self, column, method='mean'):
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
        print("colum ",column1,column2)
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
        try:
            if method == 'standard':
                scaler = StandardScaler()
            elif method == 'minmax':
                scaler = MinMaxScaler()
            elif method == 'robust':
                scaler = RobustScaler()
            elif method == 'normalizer':
                scaler = Normalizer()
            elif method == 'quantile':
                scaler = QuantileTransformer(output_distribution='normal')
            else:
                return {'error': 'Invalid scaling method'}

            self.df[columns] = scaler.fit_transform(self.df[columns])
            self.scalers[tuple(columns)] = scaler
            return {'message': f'{method} scaling applied to {columns}'}
        except Exception as e:
            return {'error': str(e)}

    def split_data(self, test_size=0.2, random_state=42, shuffle=True, stratify=False, features=None, target=None):
        try:
            if features is None or target is None:
                raise ValueError("Features and target must be specified")

            X = self.df[features]
            y = self.df[target]

            stratify_param = y if stratify else None

            X_train, X_test, y_train, y_test = train_test_split(
                X, y,
                test_size=test_size,
                random_state=random_state,
                shuffle=shuffle,
                stratify=stratify_param
            )

            return {
                'X_train': X_train.to_dict('records'),
                'X_test': X_test.to_dict('records'),
                'y_train': y_train.tolist(),
                'y_test': y_test.tolist(),
                'train_size': len(X_train),
                'test_size': len(X_test),
                'features': features,
                'target': target
            }
        except Exception as e:
            raise ValueError(f"Error splitting dataset: {str(e)}")

    def get_feature_importance(self, features):
        try:
            importance_scores = {}
            for feature in features:
                if pd.api.types.is_numeric_dtype(self.df[feature]):
                    # Calculate correlation with target if exists
                    if 'target' in self.df.columns:
                        importance = abs(
                            self.df[feature].corr(self.df['target']))
                    else:
                        # Use variance as importance if no target
                        importance = self.df[feature].var()
                    importance_scores[feature] = float(importance)
            return importance_scores
        except Exception as e:
            return {'error': str(e)}

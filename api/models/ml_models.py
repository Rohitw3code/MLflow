import numpy as np
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_squared_error, mean_absolute_error, r2_score
)

class MLModel:
    def __init__(self):
        self.model = None
        self.model_type = None
        self.algorithm = None
        
    def get_model(self, algorithm, model_type, params=None):
        self.algorithm = algorithm
        self.model_type = model_type
        
        if params is None:
            params = {}
            
        models = {
            'classification': {
                'logistic': LogisticRegression,
                'decision_tree': DecisionTreeClassifier,
                'random_forest': RandomForestClassifier,
                'svm': SVC
            },
            'regression': {
                'linear': LinearRegression,
                'decision_tree': DecisionTreeRegressor,
                'random_forest': RandomForestRegressor,
                'svm': SVR
            }
        }
        
        model_class = models.get(model_type, {}).get(algorithm)
        if model_class is None:
            raise ValueError(f"Invalid algorithm '{algorithm}' or model type '{model_type}'")
            
        self.model = model_class(**params)
        return self.model
    
    def train(self, X_train, y_train):
        if self.model is None:
            raise ValueError("Model not initialized. Call get_model first.")
        
        self.model.fit(X_train, y_train)
        return True
    
    def predict(self, X):
        if self.model is None:
            raise ValueError("Model not trained yet")
            
        predictions = self.model.predict(X)
        return predictions.tolist()
    
    def evaluate(self, X_test, y_test):
        if self.model is None:
            raise ValueError("Model not trained yet")
            
        y_pred = self.model.predict(X_test)
        
        if self.model_type == 'classification':
            metrics = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, average='weighted'),
                'recall': recall_score(y_test, y_pred, average='weighted'),
                'f1': f1_score(y_test, y_pred, average='weighted')
            }
        else:  # regression
            metrics = {
                'mse': mean_squared_error(y_test, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                'mae': mean_absolute_error(y_test, y_pred),
                'r2': r2_score(y_test, y_pred)
            }
            
        return metrics
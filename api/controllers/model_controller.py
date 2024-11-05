from flask import jsonify
import numpy as np
import pandas as pd
from models.ml_models import MLModel

class ModelController:
    def __init__(self):
        self.ml_model = MLModel()
        
    def initialize_model(self, algorithm, model_type, params):
        try:
            self.ml_model.get_model(algorithm, model_type, params)
            return jsonify({
                'message': f'Successfully initialized {algorithm} {model_type} model'
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def train_model(self, X_train, y_train):
        try:
            # Convert inputs to numpy arrays
            X_train_arr = np.array(X_train)
            y_train_arr = np.array(y_train)
            
            self.ml_model.train(X_train_arr, y_train_arr)
            
            return jsonify({
                'message': 'Model trained successfully',
                'training_samples': len(X_train),
                'features_shape': X_train_arr.shape[1]
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def evaluate_model(self, X_test, y_test):
        try:
            # Convert inputs to numpy arrays
            X_test_arr = np.array(X_test)
            y_test_arr = np.array(y_test)
            
            # Get predictions for visualization
            predictions = self.ml_model.predict(X_test_arr)
            
            # Calculate metrics
            metrics = self.ml_model.evaluate(X_test_arr, y_test_arr)
            
            # Add predictions and actual values to metrics
            metrics['predictions'] = predictions
            metrics['actual'] = y_test_arr.tolist()
            
            return jsonify({'metrics': metrics}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def make_prediction(self, features):
        try:
            # Convert input features to numpy array
            features_arr = np.array(features)
            if len(features_arr.shape) == 1:
                features_arr = features_arr.reshape(1, -1)
                
            predictions = self.ml_model.predict(features_arr)
            return jsonify({
                'predictions': predictions,
                'samples_predicted': len(predictions)
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
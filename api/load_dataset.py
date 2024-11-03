import pandas as pd
class LoadDataset:
    def __init__(self,path):
        self.dataset = pd.read_csv(path)
    def load_data(self):
        return self.dataset
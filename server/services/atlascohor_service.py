import pandas as pd
import json
from config import Config

class PersonServices:
    def __init__(self, prsondata):
        self.persondata = prsondata
        
    def get_all_person_data(self):
        return {
            'persondata': self.get_person_list(),
        }
    def get_person_list(self):
        df = self.persondata.copy()
        result = {
            "person_id": df["Person_id"].tolist(),
            "year_of_birth": df["Year_of_birth"].tolist(),
            "age": df["Age"].tolist(),
            "gender_source_value": df["Gender_source_value"].tolist(),
            "person_source_value": df["Person_source_value"].tolist()
        }
        return result

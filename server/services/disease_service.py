import pandas as pd
import json
from config import Config

class DiseaseServices:
    def __init__(self, disease_data_1, disease_data_2):
        self.disease_data_1 = disease_data_1
        self.disease_data_2 = disease_data_2
        
    def get_all_disease_data(self, date_from, date_to, department_names, grouping_type):
        return {
            'diseaseCounts': self.get_disease_Counts(grouping_type),
            'deathTally': self.get_deathTally(grouping_type),
            'patientCountByDisease': self.get_patientCount_ByDisease(grouping_type),
            'genderAgeDistribution': self.get_gender_AgeDistribution(),
            'totalSurvivalRate': self.get_total_SurvivalRate()
        }
    
    def get_disease_Counts(self, grouping_type):
        if self.disease_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.disease_data_1.copy()
        df['Date'] = pd.to_datetime(df['Date'])
        
        if grouping_type == 'monthly':
            df['GroupedDate'] = df['Date'].dt.strftime('%Y-%m')
        elif grouping_type == 'yearly':
            df['GroupedDate'] = df['Date'].dt.strftime('%Y')
        else:
            return json.dumps({"message": "Invalid grouping type"}, indent=2)
        
        grouped = df.groupby(['GroupedDate', 'Disease'])['Count'].sum().reset_index()
        
        result = []
        for disease in grouped['Disease'].unique():
            disease_data = grouped[grouped['Disease'] == disease]
            result.append({
                "x": disease_data['GroupedDate'].tolist(),
                "y": disease_data['Count'].tolist(),
                "name": disease
            })
        
        return result
    
    def get_deathTally(self, grouping_type):
        if self.disease_data_1.empty:
           return json.dumps({"message": "No data available"}, indent=2)

        df = self.disease_data_1.copy()
        df['Date'] = pd.to_datetime(df['Date'])
        
        if grouping_type == 'monthly':
            df['GroupedDate'] = df['Date'].dt.strftime('%Y-%m')
        elif grouping_type == 'yearly':
            df['GroupedDate'] = df['Date'].dt.strftime('%Y')
        else:
            return json.dumps({"message": "Invalid grouping type"}, indent=2)
        
        grouped = df.groupby(['GroupedDate', 'Disease'])['Patient Death'].sum().reset_index()
        
        death_tally = []
        for disease in grouped['Disease'].unique():
            disease_data = grouped[grouped['Disease'] == disease]
            death_tally.append({
                "x": disease_data['GroupedDate'].tolist(),
                "y": disease_data['Patient Death'].tolist(),
                "name": disease
            })
        
        return death_tally
    
    def get_patientCount_ByDisease(self, grouping_type):
        if self.disease_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.disease_data_1.copy()
        df['Date'] = pd.to_datetime(df['Date'])
        
        if grouping_type == 'monthly':
            df['GroupedDate'] = df['Date'].dt.strftime('%m-%Y')
        elif grouping_type == 'yearly':
            df['GroupedDate'] = df['Date'].dt.strftime('%Y')
        else:
            return json.dumps({"message": "Invalid grouping type"}, indent=2)
        
        # Group by Disease and sum the Count
        grouped = df.groupby('Disease')['Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('Count', ascending=False)
        
        result = [{
            "x": grouped['Disease'].tolist(),
            "y": grouped['Count'].astype(int).tolist(),
            "name": "Patient Count"
        }]
        
        return result

    def get_gender_AgeDistribution(self):
        if self.disease_data_2.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.disease_data_2.copy()
        
        # Group by Gender and sum the Count
        grouped = df.groupby('Gender')['Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('Count', ascending=False)

        result = [
            {
                "name": row['Gender'],
                "value": int(row['Count'])
            }
            for _, row in grouped.iterrows()
        ]
        
        return result
    def get_total_SurvivalRate(self):
        if self.disease_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.disease_data_1.copy()
        
        total_patients = df['Count'].sum()
        total_deaths = df['Patient Death'].sum()
        survival_rate = (total_patients - total_deaths) / total_patients * 100
        
        return round(survival_rate, 2)
import pandas as pd
import json
from datetime import datetime, timedelta
from config import Config
import numpy as np
class HomeService:
    def __init__(self, home_data_1,home_data_2,label_data):
        self.data_1 = home_data_1
        self.data_2 = home_data_2
        self.label_data=label_data
        with open(Config.HOME_DATA_PATH, 'r') as file:
            self.js = json.load(file)

    def get_all_home_data(self, date_from, date_to, department_names, grouping_type):
        return {
            'label': self.get_labels(),
            'department_wise_patient_count': self.get_department_wise_patient_count(grouping_type),
            'visits_vs_admissions': self.get_visits_vs_admissions(grouping_type),
            'gender_count': self.get_gender_count(grouping_type),
            'department_wise_patients': self.get_department_wise_patients(),
            'gender_distribution': self.get_gender_distribution(),
            'inpatient_outpatient':self.inpatient_outpatient()
        }


    def format_date(self, date, grouping_type):
        if isinstance(date, (str, int)):
            return str(date)
        if isinstance(date, np.datetime64):
            date = pd.Timestamp(date)
        if grouping_type == 'monthly':
            return date.strftime('%b %Y')
        elif grouping_type == 'weekly':
            return date.strftime('%Y-%m-%d')
        elif grouping_type == 'yearly':
            return str(date.year)
        else:
            return date.strftime('%Y-%m-%d')

    def get_department_wise_patient_count(self, grouping_type):
        if self.data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.data_1.copy()
        if grouping_type == 'monthly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif grouping_type == 'yearly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        elif grouping_type == 'weekly':
            df['Date'] = pd.to_datetime(df['Date'])
            df['Date'] = df['Date'] - pd.to_timedelta(df['Date'].dt.dayofweek, unit='D')
        
        grouped = df.groupby(['Date', 'dept_name'])['patient_count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        departments = grouped['dept_name'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for dept in departments:
            dept_data = grouped[grouped['dept_name'] == dept]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(dept_data[dept_data['Date'] == date]['patient_count'].sum()) if not dept_data[dept_data['Date'] == date].empty else 0 for date in dates],
                "name": dept
            })

        return result

    def get_visits_vs_admissions(self, grouping_type):
        if self.data_2.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.data_2.copy()
        if grouping_type == 'monthly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif grouping_type == 'yearly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        elif grouping_type == 'weekly':
            df['Date'] = pd.to_datetime(df['Date'])
            df['Date'] = df['Date'] - pd.to_timedelta(df['Date'].dt.dayofweek, unit='D')
        
        grouped = df.groupby('Date').agg({
            'admission_count': 'sum',
            'visit_count': 'sum'
        }).reset_index()
        grouped = grouped.sort_values('Date')

        dates = sorted(grouped['Date'].unique())

        result = [
            {
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": grouped['visit_count'].tolist(),
                "name": "Total Visits"
            },
            {
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": grouped['admission_count'].tolist(),
                "name": "Total Admissions"
            }
        ]

        return result

    def get_gender_count(self, grouping_type):
        if self.data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.data_1.copy()
        if grouping_type == 'monthly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif grouping_type == 'yearly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        elif grouping_type == 'weekly':
            df['Date'] = pd.to_datetime(df['Date'])
            df['Date'] = df['Date'] - pd.to_timedelta(df['Date'].dt.dayofweek, unit='D')
        
        grouped = df.groupby(['Date', 'gender'])['patient_count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        genders = grouped['gender'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for gender in genders:
            gender_data = grouped[grouped['gender'] == gender]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(gender_data[gender_data['Date'] == date]['patient_count'].sum()) if not gender_data[gender_data['Date'] == date].empty else 0 for date in dates],
                "name": gender
            })

        return result


    def get_department_wise_patients(self):
        if self.data_1 is None or self.data_1.empty:
            return []

        # Group by department and count unique patients
        department_wise_counts = self.data_1.groupby('dept_name')['patient_count'].sum().reset_index()

        
        # Rename columns for clarity
        department_wise_counts.columns = ['name', 'value']
        
        # Convert to list of dictionaries
        result = department_wise_counts.to_dict('records')
        
        return result
        

    def get_gender_distribution(self):
        if self.data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        dataframe = self.data_1.copy()
        print(dataframe)
        # Group by gender and sum the patient_count
        gender_distribution = dataframe.groupby('gender')['patient_count'].sum().reset_index()
        
        # genders = sorted(grouped['gender'].unique())
        # Convert to the desired format
        result = [
            {"name": row['gender'], "value": int(row['patient_count'])}
            for _, row in gender_distribution.iterrows()
        ]
        
        # If 'Other' is not present in the data, add it 
        
        return result



    def inpatient_outpatient(self):
        if self.data_2.empty or 'visit_count' not in self.data_2.columns or 'admission_count' not in self.data_2.columns:
            return None  # Return None instead of JSON string for invalid data
        
        dataframe = self.data_2.copy()
        
        visits = dataframe["visit_count"].sum()
        admission = dataframe["admission_count"].sum()
        
        inpatient = int(admission)
        outpatient = int(visits - admission)
        
        # Prepare data in the format expected by formatDataForPieChart
        data = [
            {"name": "Inpatients", "value": inpatient},
            {"name": "Outpatients", "value": outpatient}
        ]
        
        return data





    def get_labels(self):
        result = {}

        # Handle label_data
        if isinstance(self.label_data, pd.DataFrame) and not self.label_data.empty:
            print("Label Data:")
            print(self.label_data)
            result["patients"] = int(self.label_data["unique_patient"].iloc[0])
            result["total"] = int(self.label_data["Total"].iloc[0])
        else:
            print("Invalid or empty label_data")
            print(f"Type of label_data: {type(self.label_data)}")
            result["patients"] = 0
            result["total"] = 0

        # Handle data_2
        if isinstance(self.data_2, pd.DataFrame) and not self.data_2.empty:
            print("Data 2:")
            print(self.data_2)
            result["visits"] = int(self.data_2["visit_count"].sum())
            result["admissions"] = int(self.data_2["admission_count"].sum())
        else:
            print("Invalid or empty data_2")
            print(f"Type of data_2: {type(self.data_2)}")
            result["visits"] = 0
            result["admissions"] = 0

        print("Debug information:")
        for key, value in result.items():
            print(f"{key}: {value} (type: {type(value)})")

        return result
        
        
import json
from config import Config
import pandas as pd
import numpy as np

class DrugService:
    def __init__(self, drug_data_1, drug_data_2,drug_data_3):
        self.drug_data_1 = drug_data_3
        self.drug_data_2 = drug_data_2
        self.drug_data_3=drug_data_1
    def get_all_drug_data(self, date_from, date_to, department_names, grouping_type):
        return {
            'drug_order_count': self.get_drug_order_count(grouping_type),
            'drug_orders_by_department': self.get_drug_orders_by_department(grouping_type),
            'monthly_drug_test_counts': self.get_monthly_drug_test_counts(grouping_type),
            'patient_count_by_department': self.get_patient_count_by_department_drugtests(grouping_type),
            'patient_count_by_total_department': self.get_patient_count_by_total_department(grouping_type)
        }

    def format_date(self, date, grouping_type):
        if isinstance(date, (str, int)):
            # If date is already a string (YYYY format) or an integer, just return it as a string
            return str(date)
        if isinstance(date, np.datetime64):
            date = pd.Timestamp(date)
        if grouping_type == 'monthly':
            return date.strftime('%b %Y')
        elif grouping_type == 'yearly':
            return str(date.year)
        else:
            return date.strftime('%Y-%m-%d')  # For other grouping types


    def get_drug_order_count(self, grouping_type):
        if self.drug_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.drug_data_1.copy()
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        
        grouped = df.groupby('Date')['drug Record Count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        result = {
            "x": [self.format_date(date, grouping_type) for date in grouped['Date']],
            "y": grouped['drug Record Count'].tolist(),
            "name": "drug Order Count"
        }

        return [result]

    def get_drug_orders_by_department(self, grouping_type):
        if self.drug_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.drug_data_1.copy()
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        
        grouped = df.groupby(['Date', 'DepartmentName'])['drug Record Count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        departments = grouped['DepartmentName'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for dept in departments:
            dept_data = grouped[grouped['DepartmentName'] == dept]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(dept_data[dept_data['Date'] == date]['drug Record Count'].sum()) if not dept_data[dept_data['Date'] == date].empty else 0 for date in dates],
                "name": dept
            })

        return result

    def get_monthly_drug_test_counts(self, grouping_type):
        if self.drug_data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.drug_data_3.copy()
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        
        grouped = df.groupby(['Date', 'drug Record Name'])['drug Record Count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        drug_tests = grouped['drug Record Name'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for test in drug_tests:
            test_data = grouped[grouped['drug Record Name'] == test]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(test_data[test_data['Date'] == date]['drug Record Count'].sum()) if not test_data[test_data['Date'] == date].empty else 0 for date in dates],
                "name": test
            })

        return result

    def get_patient_count_by_total_department(self, grouping_type):
        if self.drug_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.drug_data_1.copy()
        print("drugtests")
        print(df)
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
             df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        # Group by Type and sum the Count
        print(df)
        grouped = df.groupby('DepartmentName')['drug Record Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('drug Record Count', ascending=False)
        print(grouped)
        result = [
            {
                "name": row['DepartmentName'],
                "value": int(row['drug Record Count'])
            }
            for _, row in grouped.iterrows()
        ]

        return result
    
    def get_patient_count_by_department_drugtests(self, grouping_type):
        if self.drug_data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.drug_data_3.copy()
        print("total")
        print(df)
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
             df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        # Group by Type and sum the Count
        print(df)
        grouped = df.groupby('DepartmentName')['drug Record Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('drug Record Count', ascending=False)
        print(grouped)
        result = [
            {
                "name": row['DepartmentName'],
                "value": int(row['drug Record Count'])
            }
            for _, row in grouped.iterrows()
        ]

        return result
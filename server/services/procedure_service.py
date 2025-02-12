import json
from config import Config
import pandas as pd
import numpy as np

class ProcedureService:
    def __init__(self, procedure_data_1, procedure_data_2,procedure_data_3):
        self.procedure_data_1 = procedure_data_3
        self.procedure_data_2 = procedure_data_2
        self.procedure_data_3=procedure_data_1
    def get_all_procedure_data(self, date_from, date_to, department_names, grouping_type):
        return {
            'procedure_order_count': self.get_procedure_order_count(grouping_type),
            'procedure_orders_by_department': self.get_procedure_orders_by_department(grouping_type),
            'monthly_procedure_test_counts': self.get_monthly_procedure_test_counts(grouping_type),
            'patient_count_by_department': self.get_patient_count_by_department_proceduretests(grouping_type),
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


    def get_procedure_order_count(self, grouping_type):
        if self.procedure_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.procedure_data_1.copy()
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        
        grouped = df.groupby('Date')['procedure Record Count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        result = {
            "x": [self.format_date(date, grouping_type) for date in grouped['Date']],
            "y": grouped['procedure Record Count'].tolist(),
            "name": "procedure Order Count"
        }

        return [result]

    def get_procedure_orders_by_department(self, grouping_type):
        if self.procedure_data_1.empty:
            return json.dumps({"message": "No data avaiprocedurele"}, indent=2)

        df = self.procedure_data_1.copy()
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        
        grouped = df.groupby(['Date', 'DepartmentName'])['procedure Record Count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        departments = grouped['DepartmentName'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for dept in departments:
            dept_data = grouped[grouped['DepartmentName'] == dept]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(dept_data[dept_data['Date'] == date]['procedure Record Count'].sum()) if not dept_data[dept_data['Date'] == date].empty else 0 for date in dates],
                "name": dept
            })

        return result

    def get_monthly_procedure_test_counts(self, grouping_type):
        if self.procedure_data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.procedure_data_3.copy()
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        
        grouped = df.groupby(['Date', 'procedure Record Name'])['procedure Record Count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        procedure_tests = grouped['procedure Record Name'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for test in procedure_tests:
            test_data = grouped[grouped['procedure Record Name'] == test]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(test_data[test_data['Date'] == date]['procedure Record Count'].sum()) if not test_data[test_data['Date'] == date].empty else 0 for date in dates],
                "name": test
            })

        return result

    def get_patient_count_by_total_department(self, grouping_type):
        if self.procedure_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.procedure_data_1.copy()
        print("proceduretests")
        print(df)
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
             df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        # Group by Type and sum the Count
        print(df)
        grouped = df.groupby('DepartmentName')['procedure Record Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('procedure Record Count', ascending=False)
        print(grouped)
        result = [
            {
                "name": row['DepartmentName'],
                "value": int(row['procedure Record Count'])
            }
            for _, row in grouped.iterrows()
        ]

        return result
    
    def get_patient_count_by_department_proceduretests(self, grouping_type):
        if self.procedure_data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.procedure_data_3.copy()
        print("total")
        print(df)
        if(grouping_type=='monthly'):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif(grouping_type=='yearly'):
             df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        # Group by Type and sum the Count
        print(df)
        grouped = df.groupby('DepartmentName')['procedure Record Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('procedure Record Count', ascending=False)
        print(grouped)
        result = [
            {
                "name": row['DepartmentName'],
                "value": int(row['procedure Record Count'])
            }
            for _, row in grouped.iterrows()
        ]

        return result
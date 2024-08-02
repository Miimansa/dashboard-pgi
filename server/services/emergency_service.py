import pandas as pd
import json
from datetime import datetime, timedelta
from config import Config
import numpy as np

class EmergencyServices:
    def __init__ (self,emergency_data1,emergency_data2,emergency_data3):
        self.data_1 = emergency_data1
        self.data_2 = emergency_data2
        self.data_3 = emergency_data3

    def custom_date_sort(date_string):
        return datetime.strptime(date_string, '%b %Y')
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
    
    def get_all_emergency_data(self,date_from, date_to, department_names, grouping_type):
        return {
            'uniquePatientCounts': self.get_uniquePatient_Counts(grouping_type),
            'survivalDeathCounts': self.get_survivalDeath_Counts(grouping_type),
            'durationOfStay': self.get_durationOfStay(grouping_type),
            'genderDistribution': self.get_genderDistribution(grouping_type),
            'totalPatientCount':self.get_totalPatient_Counts(grouping_type)
        }
    
    def get_uniquePatient_Counts(self,grouping_type):
        if self.data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        dataframe = self.data_1.copy()
        dataframe['Date'] = pd.to_datetime(dataframe['Date'])
        dataframe = dataframe.sort_values('Date')
        if grouping_type == 'monthly':
                date_trunc = 'M'
                date_format = '%Y-%m'
        elif grouping_type == 'weekly':
                date_trunc = 'W'
                date_format = '%Y-%W'
        elif grouping_type == 'yearly':
                date_trunc = 'Y'
                date_format = '%Y'
        elif grouping_type == 'daily':
                date_trunc = 'D'
                date_format = '%Y-%m-%d'
        else:
                return json.dumps({"message": "Invalid grouping type"}, indent=2)
            
        dataframe['GroupedDate'] = dataframe['Date'].dt.to_period(date_trunc).dt.to_timestamp()
            
        if grouping_type == 'weekly':
            dataframe['FormattedDate'] = dataframe['GroupedDate'].dt.strftime('%Y') + '-' + dataframe['GroupedDate'].dt.strftime('%W')
        else:
            dataframe['FormattedDate'] = dataframe['GroupedDate'].dt.strftime(date_format)
    
        grouped_df = dataframe.groupby(['FormattedDate', 'DepartmentName'])['Patient_Count'].sum().reset_index()
        grouped_df = grouped_df.merge(dataframe[['Date', 'FormattedDate']].drop_duplicates(), on='FormattedDate')
        
        # Sort the grouped dataframe by the original Date
        grouped_df = grouped_df.sort_values('Date')
        # Format the data as required
        result = []
        for department in grouped_df['DepartmentName'].unique():
            dept_data = grouped_df[grouped_df['DepartmentName'] == department]
            result.append({
                'x': dept_data['FormattedDate'].tolist(),
                'y': dept_data['Patient_Count'].tolist(),
                'name': department
            })
        return result


    def get_survivalDeath_Counts(self, grouping_type):
        if self.data_2.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        
        dataframe = self.data_2.copy()
        dataframe['Date'] = pd.to_datetime(dataframe['Date'])
        dataframe = dataframe.sort_values('Date')
        
        dataframe['FormattedDate'] = dataframe['Date'].apply(lambda x: self.format_date(x, grouping_type))
        
        # Group by the formatted date and discharge status, then sum up the counts
        grouped = dataframe.groupby(['FormattedDate', 'Discharge_Status'])['Count'].sum().reset_index()
        grouped = grouped.merge(dataframe[['Date', 'FormattedDate']].drop_duplicates(), on='FormattedDate')
        
        # Sort the grouped dataframe by the original Date
        grouped = grouped.sort_values('Date')
        
        result = []
        for status in ['Death', 'Normal Discharge']:
            status_data = grouped[grouped['Discharge_Status'] == status]
            result.append({
                "name": status,
                "x": status_data['FormattedDate'].tolist(),
                "y": status_data['Count'].tolist()
            })
        
        return result






    def get_durationOfStay(self, grouping_type):
        if self.data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        
        dataframe = self.data_3.copy()
        dataframe['Date'] = pd.to_datetime(dataframe['Date'])
        dataframe['FormattedDate'] = dataframe['Date'].apply(lambda x: self.format_date(x, grouping_type))
        
        # Sort the dataframe by the original Date column
        dataframe = dataframe.sort_values('Date')
        
        # Group by the formatted date and department name, then calculate the average stay
        grouped = dataframe.groupby(['FormattedDate', 'DepartmentName'])['Average Hour Stay'].mean().reset_index()
        
        # Merge with the original dataframe to get the Date for sorting
        grouped = grouped.merge(dataframe[['Date', 'FormattedDate']].drop_duplicates(), on='FormattedDate')
        
        # Sort the grouped dataframe by the original Date
        grouped = grouped.sort_values('Date')
        
        result = []
        for dept in grouped['DepartmentName'].unique():
            dept_data = grouped[grouped['DepartmentName'] == dept]
            result.append({
                "name": dept,
                "x": dept_data['FormattedDate'].tolist(),
                "y": dept_data['Average Hour Stay'].round().astype(int).tolist()  # Round to nearest integer
            })
        
        return result
    
    def get_genderDistribution(self, grouping_type):
        
        if self.data_2.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        
        dataframe = self.data_2.copy()
        
        # Convert Date to datetime if it's not already
        # Group by Gender and sum the Count
        grouped = dataframe.groupby('Discharge_Status')['Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('Count', ascending=False)
        
        # Calculate the total count
        total_count = grouped['Count'].sum()
        
        # Prepare the final data in the required format for a pie chart
        result = [
            {
                "name": row['Discharge_Status'],
                "value": int(row['Count']),
            }
            for _, row in grouped.iterrows()
        ]
        
        return result
    def get_totalPatient_Counts(self, grouping_type):
        if self.data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        
        dataframe = self.data_3.copy()
        
        # Group by DepartmentName and sum the Patient_Count
        grouped = dataframe.groupby('DepartmentName')['Average Hour Stay'].sum().reset_index()
        
        # Sort by Patient_Count in descending order
        grouped = grouped.sort_values('DepartmentName', ascending=False)
        
        # Prepare the final data in the required format for a pie chart
        result = [
            {
                "name": row['DepartmentName'],
                "value": int(row['Average Hour Stay'])
            }
            for _, row in grouped.iterrows()
        ]
        
        return result
import pandas as pd
import json
from datetime import datetime, timedelta
from config import Config
import numpy as np

class EmergencyServices:
    def __init__ (self,emergency_data1,emergency_data2,emergency_data3,emergency_data4):
        self.data_1 = emergency_data1
        self.data_2 = emergency_data2
        self.data_3 = emergency_data3
        self.data_4 = emergency_data4

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
            'totalPatientCount':self.get_totalPatient_Counts(grouping_type),
            'label': self.get_labels()
        }
    

    def get_uniquePatient_Counts(self,grouping_type):
        if self.data_4.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.data_4.copy()
        if grouping_type == 'monthly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m')
        elif grouping_type == 'yearly':
            df['Date'] = pd.to_datetime(df['Date'], format='%Y')
        elif grouping_type == 'weekly':
            df['Date'] = pd.to_datetime(df['Date'])
            df['Date'] = df['Date'] - pd.to_timedelta(df['Date'].dt.dayofweek, unit='D')
        
        grouped = df.groupby(['Date', 'dept_name'])['admission_count'].sum().reset_index()
        grouped = grouped.sort_values('Date')

        departments = grouped['dept_name'].unique()
        dates = sorted(grouped['Date'].unique())

        result = []
        for dept in departments:
            dept_data = grouped[grouped['dept_name'] == dept]
            result.append({
                "x": [self.format_date(date, grouping_type) for date in dates],
                "y": [int(dept_data[dept_data['Date'] == date]['admission_count'].sum()) if not dept_data[dept_data['Date'] == date].empty else 0 for date in dates],
                "name": dept
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
        for status in grouped['Discharge_Status'].unique():

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
        grouped = dataframe.groupby(['FormattedDate', 'DepartmentName'])['Average Hour Stay'].first().reset_index()        
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
        if self.data_4.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        
        dataframe = self.data_4.copy()
        
        # Group by DepartmentName and sum the Patient_Count
        grouped = dataframe.groupby('dept_name')['admission_count'].sum().reset_index()
        
        # Sort by Patient_Count in descending order
        grouped = grouped.sort_values('dept_name', ascending=False)
        
        # Prepare the final data in the required format for a pie chart
        result = [
            {
                "name": row['dept_name'],
                "value": int(row['admission_count'])
            }
            for _, row in grouped.iterrows()
        ]
        
        return result
    
    def get_labels(self):
        result = {}

        # Handle data_2
        if isinstance(self.data_4, pd.DataFrame) and not self.data_4.empty:
            result["admissions"] = int(self.data_4["admission_count"].sum())
        else:
            result["admissions"] = 0

        print("Debug information:")
        for key, value in result.items():
            print(f"{key}: {value} (type: {type(value)})")

        return result
        
        
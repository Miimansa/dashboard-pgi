import json
from config import Config
import pandas as pd
import numpy as np
from datetime import datetime

class ResoucesServices:
    def __init__(self, resource_data_1, resource_data_2, resource_data_3):
        self.resource_data_1 = resource_data_1
        self.resource_data_2 = resource_data_2
        self.resource_data_3 = resource_data_3

    def get_all_resources_data(self, date_from, date_to, department_names, grouping_type):
        return {
            'labels': self.get_labels(),
            'OxygencylinderByDepartment': self.get_OxygencylinderByDepartment(grouping_type),
            'bloodUsedByDepartment': self.get_blood_Used_By_Department(grouping_type),
            'operationTheaterOccupancyByDepartment': self.get_OT_Occupancy_By_Department(grouping_type),
            'operationTheaterContributionByDepartment': self.get_OT_Contribution_By_Department(grouping_type),
            'bloodPacketsUsedByBloodGroup': self.get_bloodPackets_Used_By_BloodGroup(grouping_type)
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
            return  date.strftime('%Y')
        else:
            return date.strftime('%Y-%m-%d')  # For other grouping types

    def get_OxygencylinderByDepartment(self, grouping_type):
        if self.resource_data_2.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.resource_data_2.copy()
        df['Date'] = pd.to_datetime(df['Date'])
        df['FormattedDate'] = df['Date'].apply(lambda x: self.format_date(x, grouping_type))

        grouped = df.groupby(['DepartmentName', 'FormattedDate'])['Count'].sum().reset_index()
        grouped = grouped.merge(grouped[['Date', 'FormattedDate']].drop_duplicates(), on='FormattedDate')
        
        # Sort the grouped dataframe by the original Date
        grouped = grouped.sort_values('Date')
        
        result = []
        for dept in grouped['DepartmentName'].unique():
            dept_data = grouped[grouped['DepartmentName'] == dept]
            result.append({
                "name": dept,
                "x": dept_data['FormattedDate'].tolist(),
                "y": dept_data['Count'].tolist()
            })
        
        return result

    def get_blood_Used_By_Department(self, grouping_type):
        if self.resource_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        
        df = self.resource_data_1.copy()
        print(df)
        

        # Only convert to datetime if it's not already in the correct format
        if not pd.api.types.is_datetime64_any_dtype(df['Date']):
            df['Date'] = pd.to_datetime(df['Date'], format='%Y' if grouping_type == 'yearly' else '%Y-%m')
        print(df.columns)
        df['FormattedDate'] = df['Date'].apply(lambda x: self.format_date(x, grouping_type))

        grouped = df.groupby(['DepartmentName', 'FormattedDate'])['Count'].sum().reset_index()
        date_mapping = df[['Date', 'FormattedDate']].drop_duplicates().sort_values('Date')

        # Merge the grouped data with the date mapping
        grouped = grouped.merge(date_mapping, on='FormattedDate', how='left')
        print(grouped.columns)
        grouped = grouped.sort_values('Date')
        #print(grouped)
        result = []
        for dept in grouped['DepartmentName'].unique():
            dept_data = grouped[grouped['DepartmentName'] == dept]
            result.append({
                "name": dept,
                "x": dept_data['FormattedDate'].tolist(),
                "y": dept_data['Count'].tolist()
            })
            #print("Blood data")
        #print(result)
        return result

    def get_OT_Occupancy_By_Department(self, grouping_type):
        if self.resource_data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)
        print("OT Occupancy")
        df = self.resource_data_3.copy()
        df['Date'] = pd.to_datetime(df['Date'])
        df['FormattedDate'] = df['Date'].apply(lambda x: self.format_date(x, grouping_type))

        # Group by DepartmentName and FormattedDate, sum the Count
        grouped = df.groupby(['DepartmentName', 'FormattedDate'])['Count'].sum().reset_index()

        # Create a date mapping DataFrame
        date_mapping = df[['Date', 'FormattedDate']].drop_duplicates().sort_values('Date')

        # Merge the grouped data with the date mapping
        grouped = grouped.merge(date_mapping, on='FormattedDate', how='left')
        print(grouped)
        # Sort the result by Date
        grouped = grouped.sort_values('Date')
        print(grouped)
        result = []
        for dept in grouped['DepartmentName'].unique():
            dept_data = grouped[grouped['DepartmentName'] == dept]
            result.append({
                "name": dept,
                "x": dept_data['FormattedDate'].tolist(),
                "y": dept_data['Count'].tolist()  # Convert to integer
            })
        
        return result

    def get_OT_Contribution_By_Department(self, grouping_type):
        if self.resource_data_3.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.resource_data_3.copy()
        
        # Group by DepartmentName and sum the Count
        grouped = df.groupby('DepartmentName')['Count'].sum().reset_index()
        
        # Calculate the total
        total = grouped['Count'].sum()
        
        # Calculate the contribution percentage
        grouped['Contribution'] = grouped['Count'] / total * 100
        
        # Sort by Contribution in descending order
        grouped = grouped.sort_values('Contribution', ascending=False)

        result = [
            {
                "name": row['DepartmentName'],
                "value":  int(row['Count'])  # Rounding to 2 decimal places
            }
            for _, row in grouped.iterrows()
        ]
        
        return result

    def get_bloodPackets_Used_By_BloodGroup(self, grouping_type):
        if self.resource_data_1.empty:
            return json.dumps({"message": "No data available"}, indent=2)

        df = self.resource_data_1.copy()
        
        # Group by Blood Group and sum the Count
        grouped = df.groupby('Blood Group')['Count'].sum().reset_index()
        
        # Sort by Count in descending order
        grouped = grouped.sort_values('Count', ascending=False)

        result = [
            {
                "name": row['Blood Group'],
                "value": int(row['Count'])
            }
            for _, row in grouped.iterrows()
        ]
        
        return result
    

    def get_labels(self):
        if self.resource_data_3.empty:
            return json.dumps({"message": "No Patient data available"}, indent=2)
        dataframe = self.resource_data_3.copy()
        OT = dataframe["Count"].sum()

        if self.resource_data_1.empty:
            return json.dumps({"message": "No data available for OT"}, indent=2)
        dataframe2 = self.resource_data_1.copy()
        blood_count = dataframe2["Count"].sum()
        
        result = {
            "OTCount": OT,
            "blood_count": blood_count,
            "Beds":0
        }
        
        print("Debug information:")
        for key, value in result.items():
            print(f"{key}: {value} (type: {type(value)})")
        
        # Convert numpy types to Python native types
        result = {k: v.item() if isinstance(v, np.generic) else v for k, v in result.items()}
        
        print("After conversion:")
        for key, value in result.items():
            print(f"{key}: {value} (type: {type(value)})")
        
        return result
import psycopg2
import pandas as pd
from config import Config
import numpy as np
db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

def fetch_lab_data_1(start_date, end_date, dept_names, grouping_func, lab_type):
    if lab_type != 'undefined':
        lab_services = lab_type.split(',')
    else:
        lab_services = ['16. S. ALT (SGPT)', '01. TLC', '15. S. AST (SGOT)', '03. HGB', '08. DLC']

    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_lab_one_monthly.data_month AS data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_lab_one_monthly.lab_service_name,
               mv_dash_lab_one_monthly.lr_count
        FROM mv_dash_lab_one_monthly 
        INNER JOIN hisdepartment ON mv_dash_lab_one_monthly.department = hisdepartment.department_id 
        WHERE mv_dash_lab_one_monthly.lab_service_name = ANY(%s)
          AND TO_DATE(mv_dash_lab_one_monthly.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_lab_one_monthly.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND hisdepartment.department_name = ANY(%s)
        ORDER BY mv_dash_lab_one_monthly.data_month, hisdepartment.department_name, mv_dash_lab_one_monthly.lr_count DESC
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_lab_one_yearly.data_month AS data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_lab_one_yearly.lab_service_name,
               mv_dash_lab_one_yearly.lr_count
        FROM mv_dash_lab_one_yearly 
        INNER JOIN hisdepartment ON mv_dash_lab_one_yearly.department = hisdepartment.department_id 
        WHERE mv_dash_lab_one_yearly.lab_service_name = ANY(%s)
          AND TO_DATE(mv_dash_lab_one_yearly.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_lab_one_yearly.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND hisdepartment.department_name = ANY(%s)
        ORDER BY mv_dash_lab_one_yearly.data_month, hisdepartment.department_name, mv_dash_lab_one_yearly.lr_count DESC
        """
    elif(grouping_func=='weekly'):
        query="""
	SELECT mv_dash_lab_one_weekly.data_month AS data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_lab_one_weekly.lab_service_name,
               mv_dash_lab_one_weekly.lr_count
        FROM mv_dash_lab_one_weekly 
        INNER JOIN hisdepartment ON mv_dash_lab_one_weekly.department = hisdepartment.department_id 
        WHERE mv_dash_lab_one_weekly.lab_service_name = ANY(%s)
          AND mv_dash_lab_one_weekly.data_month >=%s
          AND mv_dash_lab_one_weekly.data_month <= %s
          AND hisdepartment.department_name = ANY(%s)
        ORDER BY mv_dash_lab_one_weekly.data_month, hisdepartment.department_name, mv_dash_lab_one_weekly.lr_count DESC"""
    print(start_date)
    print(end_date)
    
    lab_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (lab_services, start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (lab_services, start_date, end_date, dept_names))
        rows = cur.fetchall()
        lab_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Lab Record Name', 'Lab Record Count'])
        print(lab_data_1)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return lab_data_1

import psycopg2
import pandas as pd

def fetch_lab_data_2(start_date, end_date, dept_names, grouping_func):

    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query=f"""select * from Lab_D2_Month WHERE TO_DATE(Lab_D2_Month.Date, 'MM YYYY') >= TO_DATE('{start_date}', 'MM YYYY')
          AND TO_DATE(Lab_D2_Month.Date, 'MM YYYY') <= TO_DATE('{end_date}', 'MM YYYY')"""
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""select * from Lab_D2_Yearly WHERE TO_DATE(Lab_D2_Yearly.Date, 'YYYY') >= TO_DATE('{start_date}', 'YYYY')
          AND TO_DATE(Lab_D2_Yearly.Date, 'YYYY') <= TO_DATE('{end_date}', 'YYYY')"""
    elif grouping_func == 'daily':
        date_trunc = 'day'
        date_format = 'YYYY-MM-DD'
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    # query = f"""
    # #qeery here """

    lab_data_2=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.lstrip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, tuple(dept_names))).decode('utf-8'))
        cur.execute(query, (start_date, end_date, tuple(dept_names)))
        rows = cur.fetchall()
        
        lab_data_2 = pd.DataFrame(rows, columns=['Date', 'DepartmentName','Type', 'Count'])
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return lab_data_2

def fetch_lab_data_3(start_date, end_date, dept_names, grouping_func):
   
    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_lab_one_monthly.data_month AS data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_lab_one_monthly.lab_service_name,
               mv_dash_lab_one_monthly.lr_count
        FROM mv_dash_lab_one_monthly 
        INNER JOIN hisdepartment ON mv_dash_lab_one_monthly.department = hisdepartment.department_id 
          WHERE TO_DATE(mv_dash_lab_one_monthly.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_lab_one_monthly.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND hisdepartment.department_name = ANY(%s)
        ORDER BY mv_dash_lab_one_monthly.data_month, hisdepartment.department_name, mv_dash_lab_one_monthly.lr_count DESC
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_lab_one_yearly.data_month AS data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_lab_one_yearly.lab_service_name,
               mv_dash_lab_one_yearly.lr_count
        FROM mv_dash_lab_one_yearly 
        INNER JOIN hisdepartment ON mv_dash_lab_one_yearly.department = hisdepartment.department_id 
        WHERE 
           TO_DATE(mv_dash_lab_one_yearly.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_lab_one_yearly.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND hisdepartment.department_name = ANY(%s)
        ORDER BY mv_dash_lab_one_yearly.data_month, hisdepartment.department_name, mv_dash_lab_one_yearly.lr_count DESC
        """
    elif(grouping_func=='weekly'):
        query="""
	SELECT mv_dash_lab_one_weekly.data_month AS data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_lab_one_weekly.lab_service_name,
               mv_dash_lab_one_weekly.lr_count
        FROM mv_dash_lab_one_weekly 
        INNER JOIN hisdepartment ON mv_dash_lab_one_weekly.department = hisdepartment.department_id WHERE
           mv_dash_lab_one_weekly.data_month >=%s
          AND mv_dash_lab_one_weekly.data_month <= %s
          AND hisdepartment.department_name = ANY(%s)
        ORDER BY mv_dash_lab_one_weekly.data_month, hisdepartment.department_name, mv_dash_lab_one_weekly.lr_count DESC"""
    print(start_date)
    print(end_date)
    
    lab_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, ( start_date, end_date, dept_names))
        rows = cur.fetchall()
        lab_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Lab Record Name', 'Lab Record Count'])
        print(lab_data_1)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return lab_data_1

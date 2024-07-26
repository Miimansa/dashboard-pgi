import psycopg2
import pandas as pd
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

def fetch_disease_data_1(start_date, end_date, dept_names, grouping_func):

    # Mapping grouping_func to appropriate SQL date truncation and date format
    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query=f"""select * from Disease_D1_Month WHERE TO_DATE(Disease_D1_Month.Date, 'MM YYYY') >= TO_DATE('{start_date}', 'MM YYYY')
          AND TO_DATE(Disease_D1_Month.Date, 'MM YYYY') <= TO_DATE('{end_date}', 'MM YYYY')"""
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""select * from Disease_D1_Yearly WHERE TO_DATE(Disease_D1_Yearly.Date, 'YYYY') >= TO_DATE('{start_date}', 'YYYY')
          AND TO_DATE(Disease_D1_Yearly.Date, 'YYYY') <= TO_DATE('{end_date}', 'YYYY')"""
    print(start_date)
    print(end_date)
    # query = f"""
    # #SQL QUERY HERE
    # """
    
    disease_data_1=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.lstrip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, tuple(dept_names))).decode('utf-8'))
        cur.execute(query, (start_date, end_date, tuple(dept_names)))
        rows = cur.fetchall()
        disease_data_1 = pd.DataFrame(rows, columns=['Date','Disease','Count','Patient Death'])
        #print(disease_data_1)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return disease_data_1

import psycopg2
import pandas as pd

def fetch_disease_data_2(start_date, end_date, dept_names, grouping_func):

    # Mapping grouping_func to appropriate SQL date truncation and date format
    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query=f"""select * from Disease_D2_Month WHERE TO_DATE(Disease_D2_Month.Date, 'MM YYYY') >= TO_DATE('{start_date}', 'MM YYYY')
          AND TO_DATE(Disease_D2_Month.Date, 'MM YYYY') <= TO_DATE('{end_date}', 'MM YYYY')"""
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""select * from Disease_D2_Yearly WHERE TO_DATE(Disease_D2_Yearly.Date, 'YYYY') >= TO_DATE('{start_date}', 'YYYY')
          AND TO_DATE(Disease_D2_Yearly.Date, 'YYYY') <= TO_DATE('{end_date}', 'YYYY')"""

    # query = f"""
    # #qeery here """

    disease_data_2=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.lstrip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, tuple(dept_names))).decode('utf-8'))
        cur.execute(query, (start_date, end_date, tuple(dept_names)))
        rows = cur.fetchall()
        disease_data_2 = pd.DataFrame(rows, columns=['Date', 'Gender','Disease','Age','Count'])

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return disease_data_2

import psycopg2
import pandas as pd
from datetime import datetime
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

def fetch_home_data_1(start_date, end_date, dept_names, grouping_func):
    print(dept_names)
    print(start_date)
    print(end_date)
    
    # Mapping grouping_func to appropriate SQL date truncation and date format
    if grouping_func == 'monthly':
        query = f"""
        SELECT mv_dash_home_one_monthly.data_month as data_date,
               mv_dash_home_one_monthly.count as patient_count,
               mv_dash_home_one_monthly.gender,
               hisdepartment.department_name as dept_name
        FROM mv_dash_home_one_monthly 
        INNER JOIN hisdepartment ON mv_dash_home_one_monthly.depid = hisdepartment.department_id
        WHERE TO_DATE(mv_dash_home_one_monthly.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_home_one_monthly.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'weekly':
        query = f"""
       select mv_dash_home_one_weekly.data_month as data_date
	, mv_dash_home_one_weekly.count as patient_count
	, mv_dash_home_one_weekly.gender
	, hisdepartment.department_name as dept_name
from mv_dash_home_one_weekly 
inner join hisdepartment on mv_dash_home_one_weekly.depid = hisdepartment.department_id
WHERE  mv_dash_home_one_weekly.data_month >= %s
          AND mv_dash_home_one_weekly.data_month <= %s
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'yearly':
        query = f"""
        SELECT mv_dash_home_one_year.data_month as data_date,
               mv_dash_home_one_year.count as patient_count,
               mv_dash_home_one_year.gender,
               hisdepartment.department_name as dept_name
        FROM mv_dash_home_one_year 
        INNER JOIN hisdepartment ON mv_dash_home_one_year.depid = hisdepartment.department_id
        WHERE TO_DATE(mv_dash_home_one_year.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_home_one_year.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'daily':
        query = f"""
        SELECT mv_dash_home_one.data_month as data_date,
               mv_dash_home_one.count as patient_count,
               mv_dash_home_one.gender,
               hisdepartment.department_name as dept_name
        FROM mv_dash_home_one 
        INNER JOIN hisdepartment ON mv_dash_home_one.depid = hisdepartment.department_id
        WHERE TO_DATE(mv_dash_home_one.data_month, 'YYYY-MM-DD') >= TO_DATE(%s, 'YYYY-MM-DD')
          AND TO_DATE(mv_dash_home_one.data_month, 'YYYY-MM-DD') <= TO_DATE(%s, 'YYYY-MM-DD')
          AND hisdepartment.department_name = ANY(%s)
        """
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    print(start_date)
    print(end_date)

    home_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        home_data_1 = pd.DataFrame(rows, columns=['Date', 'patient_count', 'gender', 'dept_name'])
        print(home_data_1)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return home_data_1

import psycopg2
import pandas as pd

def fetch_home_data_2(start_date, end_date, dept_names, grouping_func):

    # Mapping grouping_func to appropriate SQL date truncation and date format
    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query = f"""select mv_dash_home_two.data_date
        , mv_dash_home_two.admission_count
        , mv_dash_home_two.visit_count
        , hisdepartment.department_name as dept_name
    from mv_dash_home_two 
    inner join hisdepartment on mv_dash_home_two.depid = hisdepartment.department_id
            WHERE TO_DATE(mv_dash_home_two.data_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_home_two.data_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND hisdepartment.department_name = ANY(%s);
    """
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
        query = f"""select mv_dash_home_two_weekly.data_date
	, mv_dash_home_two_weekly.admission_count
	, mv_dash_home_two_weekly.visit_count
	, hisdepartment.department_name as dept_name
from mv_dash_home_two_weekly 
inner join hisdepartment on mv_dash_home_two_weekly.depid = hisdepartment.department_id
WHERE  mv_dash_home_two_weekly.data_date >= %s
          AND mv_dash_home_two_weekly.data_date <= %s
          AND hisdepartment.department_name = ANY(%s)
    """
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query =  f"""select mv_dash_home_two_yearly.data_date
, mv_dash_home_two_yearly.admission_count
, mv_dash_home_two_yearly.visit_count
, hisdepartment.department_name as dept_name
from mv_dash_home_two_yearly
inner join hisdepartment on mv_dash_home_two_yearly.depid = hisdepartment.department_id
        WHERE TO_DATE(mv_dash_home_two_yearly.data_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_home_two_yearly.data_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND hisdepartment.department_name = ANY(%s)
    """
    elif grouping_func == 'daily':
        date_trunc = 'day'
        date_format = 'YYYY-MM-DD'
         # query = f"""select mv_dash_home_two.data_date
    #     , mv_dash_home_two.admission_count
    #     , mv_dash_home_two.visit_count
    #     , hisdepartment.department_name as dept_name
    # from mv_dash_home_two 
    # inner join hisdepartment on mv_dash_home_two.depid = hisdepartment.department_id;
    # """
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")


    
    home_data_2=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        home_data_2 = pd.DataFrame(rows, columns=['Date', 'admission_count','visit_count', 'dept_name'])

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return home_data_2



def fetch_label(start_date, end_date, dept_names):
    query = """
    select count(*), count(distinct visit_fk) 
    from mv_visit 
    INNER JOIN hisdepartment ON mv_visit.depid = hisdepartment.department_id
    WHERE mv_visit.visit_date BETWEEN TO_DATE(%s, 'YYYY-MM-DD') AND TO_DATE(%s, 'YYYY-MM-DD')
      AND hisdepartment.department_name = ANY(%s)
    """
    print(query)
    label_data = pd.DataFrame()
    
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print("Executed query:")
        
        # Convert start_date and end_date to datetime objects if they're strings
        if isinstance(start_date, str):
            date_from = datetime.strptime(start_date, '%m-%d-%Y')
        else:
            date_from = start_date
        
        if isinstance(end_date, str):
            date_to = datetime.strptime(end_date, '%m-%d-%Y')
        else:
            date_to = end_date
        
        # Format datetime objects to strings in 'YYYY-MM-DD' format
        date_from_str = date_from.strftime('%Y-%m-%d')
        date_to_str = date_to.strftime('%Y-%m-%d')
        
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (date_from_str, date_to_str, dept_names)).decode('utf-8'))
        cur.execute(query, (date_from_str, date_to_str, dept_names))
        rows = cur.fetchall()
        label_data = pd.DataFrame(rows, columns=['Total', 'unique_patient'])
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return label_data
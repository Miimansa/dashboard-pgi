import psycopg2
import pandas as pd
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

def fetch_resources_data_1(start_date, end_date, dept_names, grouping_func):
    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_res_one_monthly.data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_res_one_monthly.bloodgroup,
               mv_dash_res_one_monthly.b_count
        FROM mv_dash_res_one_monthly 
        INNER JOIN hisdepartment ON mv_dash_res_one_monthly.department = hisdepartment.department_id
        WHERE TO_DATE(mv_dash_res_one_monthly.data_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_res_one_monthly.data_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_res_one_yearly.data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_res_one_yearly.bloodgroup,
               mv_dash_res_one_yearly.b_count
        FROM mv_dash_res_one_yearly 
        INNER JOIN hisdepartment ON mv_dash_res_one_yearly.department = hisdepartment.department_id 
        WHERE TO_DATE(mv_dash_res_one_yearly.data_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_res_one_yearly.data_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'weekly':
         query = """
        SELECT mv_dash_res_one_weekly.data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_res_one_weekly.bloodgroup,
               mv_dash_res_one_weekly.b_count
        FROM mv_dash_res_one_weekly 
        INNER JOIN hisdepartment ON mv_dash_res_one_weekly.department = hisdepartment.department_id 
        WHERE mv_dash_res_one_weekly.data_date >= %s
          AND mv_dash_res_one_weekly.data_date <= %s
          AND hisdepartment.department_name = ANY(%s)
        """
        
    elif grouping_func == 'daily':
        # Add query for daily data if needed
        raise NotImplementedError("Daily grouping is not implemented yet.")
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    print(start_date)
    print(end_date)
    
    resources_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        resources_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Blood Group', 'Count'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return resources_data_1
import psycopg2
import pandas as pd

def fetch_resources_data_2(start_date, end_date, dept_names, grouping_func):

    # Mapping grouping_func to appropriate SQL date truncation and date format
    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query=f"""select * from Resources_D2_Month WHERE TO_DATE(Resources_D2_Month.Date, 'MM YYYY') >= TO_DATE('{start_date}', 'MM YYYY')
          AND TO_DATE(Resources_D2_Month.Date, 'MM YYYY') <= TO_DATE('{end_date}', 'MM YYYY')"""
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""select * from Resources_D2_Yearly WHERE TO_DATE(Resources_D2_Yearly.Date, 'YYYY') >= TO_DATE('{start_date}', 'YYYY')
          AND TO_DATE(Resources_D2_Yearly.Date, 'YYYY') <= TO_DATE('{end_date}', 'YYYY')"""
    elif grouping_func == 'daily':
        date_trunc = 'day'
        date_format = 'YYYY-MM-DD'
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    # query = f"""
    # #qeery here """

    resources_data_2=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        resources_data_2 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Count'])

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return resources_data_2

def fetch_resources_data_3(start_date, end_date, dept_names, grouping_func):
    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_res_ot_monthly.data_date,
               mv_dash_res_ot_monthly.dept_name,
               1 AS ot_no,
               mv_dash_res_ot_monthly.ot_count
        FROM mv_dash_res_ot_monthly
        WHERE TO_DATE(mv_dash_res_ot_monthly.data_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_res_ot_monthly.data_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND mv_dash_res_ot_monthly.dept_name = ANY(%s)
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_res_ot_yearly.data_date,
               mv_dash_res_ot_yearly.dept_name,
               1 AS ot_no,
               mv_dash_res_ot_yearly.ot_count
        FROM mv_dash_res_ot_yearly
        WHERE TO_DATE(mv_dash_res_ot_yearly.data_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_res_ot_yearly.data_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND mv_dash_res_ot_yearly.dept_name = ANY(%s)
        """
    elif grouping_func == 'weekly':
        query = """
        SELECT mv_dash_res_ot_weekly.data_date,
               mv_dash_res_ot_weekly.dept_name,
               1 AS ot_no,
               mv_dash_res_ot_weekly.ot_count
        FROM mv_dash_res_ot_weekly
      WHERE mv_dash_res_ot_weekly.data_date >=%s AND
         mv_dash_res_ot_weekly.data_date <= %s
          AND mv_dash_res_ot_weekly.dept_name = ANY(%s)
        """
    elif grouping_func == 'daily':
        # Add query for daily data if needed
        raise NotImplementedError("Daily grouping is not implemented yet.")
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    resources_data_3 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        resources_data_3 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Operation Theater Number', 'Count'])

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return resources_data_3

def fetch_resources_data_4(start_date, end_date, dept_names, grouping_func,blood_groups):
    print(blood_groups)
    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_res_one_monthly.data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_res_one_monthly.bloodgroup,
               mv_dash_res_one_monthly.b_count
        FROM mv_dash_res_one_monthly 
        INNER JOIN hisdepartment ON mv_dash_res_one_monthly.department = hisdepartment.department_id
        WHERE TO_DATE(mv_dash_res_one_monthly.data_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_res_one_monthly.data_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND mv_dash_res_one_monthly.bloodgroup = ANY(%s)
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_res_one_yearly.data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_res_one_yearly.bloodgroup,
               mv_dash_res_one_yearly.b_count
        FROM mv_dash_res_one_yearly 
        INNER JOIN hisdepartment ON mv_dash_res_one_yearly.department = hisdepartment.department_id 
        WHERE TO_DATE(mv_dash_res_one_yearly.data_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_res_one_yearly.data_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND mv_dash_res_one_yearly.bloodgroup = ANY(%s)
          AND hisdepartment.department_name = ANY(%s)
        """
    elif grouping_func == 'weekly':
         query = """
        SELECT mv_dash_res_one_weekly.data_date,
               hisdepartment.department_name AS dept_name,
               mv_dash_res_one_weekly.bloodgroup,
               mv_dash_res_one_weekly.b_count
        FROM mv_dash_res_one_weekly 
        INNER JOIN hisdepartment ON mv_dash_res_one_weekly.department = hisdepartment.department_id 
        WHERE mv_dash_res_one_weekly.data_date >= %s
          AND mv_dash_res_one_weekly.data_date <= %s
          AND mv_dash_res_one_weekly.bloodgroup = ANY(%s)
          AND hisdepartment.department_name = ANY(%s)
        """
        
    elif grouping_func == 'daily':
        # Add query for daily data if needed
        raise NotImplementedError("Daily grouping is not implemented yet.")
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    print(start_date)
    print(end_date)
    
    resources_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        print(query)
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date,blood_groups, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date,blood_groups, dept_names))
        rows = cur.fetchall()
        resources_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Blood Group', 'Count'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return resources_data_1
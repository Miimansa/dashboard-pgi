import psycopg2
import pandas as pd
from config import Config

db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

def fetch_emergency_data_1(start_date, end_date, dept_names, grouping_func):
    print(start_date)
    print(end_date)
    # Mapping grouping_func to appropriate SQL date truncation and date format
    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query=f"""select * from Emergency_D1_Month WHERE TO_DATE(Emergency_D1_Month.Date, 'MM YYYY') >= TO_DATE('{start_date}', 'MM YYYY')
          AND TO_DATE(Emergency_D1_Month.Date, 'MM YYYY') <= TO_DATE('{end_date}', 'MM YYYY')"""
        #query=f"""select * from mv_dash_emrg_one_yearly where dischargestatus = 'Death';"""
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""select * from Emergency_D1_Yearly WHERE TO_DATE(Emergency_D1_Yearly.Date, 'YYYY') >= TO_DATE('{start_date}', 'YYYY')
          AND TO_DATE(Emergency_D1_Yearly.Date, 'YYYY') <= TO_DATE('{end_date}', 'YYYY')"""
        # query=f"""select * from mv_dash_emrg_one_yearly where dischargestatus = 'Death';"""
    print(start_date)
    print(end_date)
    
    emergency_data_1=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.lstrip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, tuple(dept_names))).decode('utf-8'))
        cur.execute(query, (start_date, end_date, tuple(dept_names)))
        rows = cur.fetchall()
        emergency_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Patient_Count', 'Gender'])
        #print(emergency_data_1)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return emergency_data_1

import psycopg2
import pandas as pd
def fetch_emergency_data_2(start_date, end_date, dept_names, grouping_func,discharge_type):
    print(discharge_type)
    if discharge_type != 'undefined':
        discharge_services = discharge_type.split(',')
    else:
        discharge_services = ['Death', 'Normal Discharge']
    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_emrg_one_monthly.data_date,
               mv_dash_emrg_one_monthly.department_name AS department_name,
               dischargestatus,
               mv_dash_emrg_one_monthly.count AS patient_count
        FROM mv_dash_emrg_one_monthly
        WHERE dischargestatus = ANY(%s)
          AND TO_DATE(mv_dash_emrg_one_monthly.data_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_emrg_one_monthly.data_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND mv_dash_emrg_one_monthly.department_name = ANY(%s)
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_emrg_one_yearly.data_date,
               mv_dash_emrg_one_yearly.department_name AS department_name,
               dischargestatus,
               mv_dash_emrg_one_yearly.count AS patient_count
        FROM mv_dash_emrg_one_yearly
        WHERE dischargestatus = ANY(%s)
          AND TO_DATE(mv_dash_emrg_one_yearly.data_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_emrg_one_yearly.data_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND mv_dash_emrg_one_yearly.department_name = ANY(%s)
        """
    elif grouping_func =='weekly':
        query="""
select mv_dash_emrg_one_weekly.data_date ,
mv_dash_emrg_one_weekly.department_name AS department_name, dischargestatus, 
    mv_dash_emrg_one_weekly.count AS patient_count
FROM 
    mv_dash_emrg_one_weekly 
WHERE 
    dischargestatus = ANY(%s)
    AND mv_dash_emrg_one_weekly.data_date >=%s
          AND mv_dash_emrg_one_weekly.data_date <= %s
          AND mv_dash_emrg_one_weekly.department_name = ANY(%s)
    ;
    """
    elif grouping_func in [ 'daily']:
        raise NotImplementedError(f"{grouping_func} grouping is not implemented yet.")
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    emergency_data_2 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (discharge_services,start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (discharge_services,start_date, end_date, dept_names))
        rows = cur.fetchall()
        emergency_data_2 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Discharge_Status', 'Count'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return emergency_data_2

def fetch_emergency_data_3(start_date, end_date, dept_names, grouping_func):
    if grouping_func == 'monthly':
        query = """
        SELECT mv_dash_emrg_two_monthly.data_date,
               mv_dash_emrg_two_monthly.department_name,
               ROUND(CAST(mv_dash_emrg_two_monthly.avg_dur AS numeric), 0) AS avg_dur,
               mv_dash_emrg_two_monthly.gender
        FROM mv_dash_emrg_two_monthly
        WHERE TO_DATE(mv_dash_emrg_two_monthly.data_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
          AND TO_DATE(mv_dash_emrg_two_monthly.data_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
          AND mv_dash_emrg_two_monthly.department_name = ANY(%s)
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT mv_dash_emrg_two_yearly.data_date,
               mv_dash_emrg_two_yearly.department_name,
               ROUND(CAST(mv_dash_emrg_two_yearly.avg_dur AS numeric), 0) AS avg_dur,
               mv_dash_emrg_two_yearly.gender
        FROM mv_dash_emrg_two_yearly
        WHERE TO_DATE(mv_dash_emrg_two_yearly.data_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
          AND TO_DATE(mv_dash_emrg_two_yearly.data_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
          AND mv_dash_emrg_two_yearly.department_name = ANY(%s)
        """
    elif grouping_func =='weekly':
        query="""
SELECT 
    mv_dash_emrg_two_weekly.data_date, 
    mv_dash_emrg_two_weekly.department_name,
    ROUND(CAST(mv_dash_emrg_two_weekly.avg_dur AS numeric), 0) AS avg_dur,
    mv_dash_emrg_two_weekly.gender
FROM 
    mv_dash_emrg_two_weekly
 WHERE mv_dash_emrg_two_weekly.data_date >=%s
          AND mv_dash_emrg_two_weekly.data_date <= %s
          AND mv_dash_emrg_two_weekly.department_name = ANY(%s)

    ;
    """
    elif grouping_func in ['daily']:
        raise NotImplementedError(f"{grouping_func} grouping is not implemented yet.")
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    emergency_data_3 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        emergency_data_3 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'Average Hour Stay', 'Gender'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return emergency_data_3

def fetch_emergency_data_4(start_date, end_date, dept_names, grouping_func):

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
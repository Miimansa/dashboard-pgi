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
        SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.lab_service_name,
        subquery.lr_count
    FROM (
        SELECT TO_CHAR(m.measurement_date, 'YYYY-MM') AS data_month,
            COALESCE(v.care_site_id, 24473) AS department,
            c.concept_id AS lab_service_id,
            c.concept_name AS lab_service_name,
            COUNT(*) AS lr_count
        FROM measurements AS m
        INNER JOIN visit_occurrence AS v ON m.visit_occurrence_id = v.visit_occurrence_id
        INNER JOIN concept AS c ON m.measurement_concept_id = c.concept_id 
        GROUP BY data_month, department, lab_service_id, lab_service_name
        ORDER BY data_month
    ) AS subquery
    INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    WHERE subquery.lab_service_name = ANY(%s)
    AND TO_DATE(subquery.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
    AND TO_DATE(subquery.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
    AND care_site.care_site_name = ANY(%s)
    ORDER BY subquery.data_month, care_site.care_site_name, subquery.lr_count DESC;
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.lab_service_name,
        subquery.lr_count
    FROM (
        SELECT TO_CHAR(m.measurement_date, 'YYYY') AS data_month,
            COALESCE(v.care_site_id, 24473) AS department,
            c.concept_id AS lab_service_id,
            c.concept_name AS lab_service_name,
            COUNT(*) AS lr_count
        FROM measurements AS m
        INNER JOIN visit_occurrence AS v ON m.visit_occurrence_id = v.visit_occurrence_id
        INNER JOIN concept AS c ON m.measurement_concept_id = c.concept_id 
        GROUP BY data_month, department, lab_service_id, lab_service_name
        ORDER BY data_month
    ) AS subquery
    INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    WHERE subquery.lab_service_name = ANY(%s)
    AND TO_DATE(subquery.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
    AND TO_DATE(subquery.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
    AND care_site.care_site_name = ANY(%s)
    ORDER BY subquery.data_month, care_site.care_site_name, subquery.lr_count DESC;
        """
    elif(grouping_func=='weekly'):
        query="""
            SELECT subquery.data_month AS data_date,
            care_site.care_site_name AS dept_name,
            subquery.lab_service_name,
            subquery.lr_count
        FROM (
            SELECT date_trunc('week',m.measurement_date) AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS lab_service_id,
                c.concept_name AS lab_service_name,
                COUNT(*) AS lr_count
            FROM measurements AS m
            INNER JOIN visit_occurrence AS v ON m.visit_occurrence_id = v.visit_occurrence_id
            INNER JOIN concept AS c ON m.measurement_concept_id = c.concept_id 
            GROUP BY data_month, department, lab_service_id, lab_service_name
            ORDER BY data_month
        ) AS subquery
        INNER JOIN care_site ON subquery.department = care_site.care_site_id 
        WHERE subquery.lab_service_name = ANY(%s)
        AND subquery.data_month >= %s
        AND subquery.data_month <=%s
        AND care_site.care_site_name = ANY(%s)
        ORDER BY subquery.data_month, care_site.care_site_name, subquery.lr_count DESC;
        """
    print(start_date)
    print(end_date)
    
    lab_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print("###############################################")
        print(cur.mogrify(query, (lab_services, start_date, end_date, dept_names)).decode('utf-8'))
        print("###############################################")
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
        query=f"""
            SELECT 
                to_char(m.measurement_date,'YYYY-MM') as date, 
                c.care_site_name as departmentname, 
                CASE 
                    WHEN v.visit_concept_id = 32217 THEN 'Inpatient'
                    WHEN v.visit_concept_id = 9203 THEN 'Outpatient'
                END AS type,
                COUNT(*)  
            FROM measurements AS m 
            INNER JOIN visit_occurrence AS v 
            ON m.visit_occurrence_id = v.visit_occurrence_id
            INNER JOIN care_site AS c 
            ON c.care_site_id = COALESCE(v.care_site_id, 24473)
            WHERE v.visit_concept_id IN (9203, 32217)
            AND TO_DATE(m.measurement_date, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
            AND TO_DATE(m.measurement_date, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
            GROUP BY m.measurement_date, c.care_site_name, type
          """
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
        query=f"""
            SELECT 
                date_trunc('week',m.measurement_date) as date, 
                c.care_site_name as departmentname, 
                CASE 
                    WHEN v.visit_concept_id = 32217 THEN 'Inpatient'
                    WHEN v.visit_concept_id = 9203 THEN 'Outpatient'
                END AS type,
                COUNT(*)  
            FROM measurements AS m 
            INNER JOIN visit_occurrence AS v 
            ON m.visit_occurrence_id = v.visit_occurrence_id
            INNER JOIN care_site AS c 
            ON c.care_site_id = COALESCE(v.care_site_id, 24473)
            WHERE v.visit_concept_id IN (9203, 32217) 
            AND m.measurement_date >=  %s
            AND m.measurement_date <=  %s
            GROUP BY m.measurement_date, c.care_site_name, type 
          """
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""
            SELECT 
                to_char(m.measurement_date,'YYYY') as date, 
                c.care_site_name as departmentname, 
                CASE 
                    WHEN v.visit_concept_id = 32217 THEN 'Inpatient'
                    WHEN v.visit_concept_id = 9203 THEN 'Outpatient'
                END AS type,
                COUNT(*)  
            FROM measurements AS m 
            INNER JOIN visit_occurrence AS v 
            ON m.visit_occurrence_id = v.visit_occurrence_id
            INNER JOIN care_site AS c 
            ON c.care_site_id = COALESCE(v.care_site_id, 24473)
            WHERE v.visit_concept_id IN (9203, 32217) 
            AND TO_DATE(m.measurement_date, 'YYYY') >= TO_DATE(%s, 'YYYY')
            AND TO_DATE(m.measurement_date, 'YYYY') <= TO_DATE(%s, 'YYYY')
            GROUP BY m.measurement_date, c.care_site_name, type
          """
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
        SELECT subquery.data_month AS data_date,
                care_site.care_site_name AS dept_name,
                subquery.lab_service_name,
                subquery.lr_count
            FROM (
                SELECT TO_CHAR(m.measurement_date, 'YYYY-MM') AS data_month,
                    COALESCE(v.care_site_id, 24473) AS department,
                    c.concept_id AS lab_service_id,
                    c.concept_name AS lab_service_name,
                    COUNT(*) AS lr_count
                FROM measurements AS m
                INNER JOIN visit_occurrence AS v ON m.visit_occurrence_id = v.visit_occurrence_id
                INNER JOIN concept AS c ON m.measurement_concept_id = c.concept_id 
                GROUP BY data_month, department, lab_service_id, lab_service_name
                ORDER BY data_month
            ) AS subquery
            INNER JOIN care_site ON subquery.department = care_site.care_site_id 
            AND TO_DATE(subquery.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
            AND TO_DATE(subquery.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
            AND care_site.care_site_name = ANY(%s)
            ORDER BY subquery.data_month, care_site.care_site_name, subquery.lr_count DESC;
        """
    elif grouping_func == 'yearly':
        query = """
        SELECT subquery.data_month AS data_date,
                care_site.care_site_name AS dept_name,
                subquery.lab_service_name,
                subquery.lr_count
            FROM (
                SELECT TO_CHAR(m.measurement_date, 'YYYY') AS data_month,
                    COALESCE(v.care_site_id, 24473) AS department,
                    c.concept_id AS lab_service_id,
                    c.concept_name AS lab_service_name,
                    COUNT(*) AS lr_count
                FROM measurements AS m
                INNER JOIN visit_occurrence AS v ON m.visit_occurrence_id = v.visit_occurrence_id
                INNER JOIN concept AS c ON m.measurement_concept_id = c.concept_id 
                GROUP BY data_month, department, lab_service_id, lab_service_name
                ORDER BY data_month
            ) AS subquery
            INNER JOIN care_site ON subquery.department = care_site.care_site_id 
            AND TO_DATE(subquery.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
            AND TO_DATE(subquery.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
            AND care_site.care_site_name = ANY(%s)
            ORDER BY subquery.data_month, care_site.care_site_name, subquery.lr_count DESC;
        """
    elif(grouping_func=='weekly'):
        query="""
        SELECT subquery.data_month AS data_date,
                care_site.care_site_name AS dept_name,
                subquery.lab_service_name,
                subquery.lr_count
            FROM (
                SELECT  date_trunc('week',m.measurement_date) AS data_month,
                    COALESCE(v.care_site_id, 24473) AS department,
                    c.concept_id AS lab_service_id,
                    c.concept_name AS lab_service_name,
                    COUNT(*) AS lr_count
                FROM measurements AS m
                INNER JOIN visit_occurrence AS v ON m.visit_occurrence_id = v.visit_occurrence_id
                INNER JOIN concept AS c ON m.measurement_concept_id = c.concept_id 
                GROUP BY data_month, department, lab_service_id, lab_service_name
                ORDER BY data_month
            ) AS subquery
            INNER JOIN care_site ON subquery.department = care_site.care_site_id 
            AND subquery.data_month >= %s
            AND subquery.data_month<= %s
            AND care_site.care_site_name = ANY(%s)
            ORDER BY subquery.data_month, care_site.care_site_name, subquery.lr_count DESC;
            """
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

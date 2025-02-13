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

def fetch_drug_data_1(start_date, end_date, dept_names, grouping_func, drug_type):
    if drug_type != 'undefined':
        drug_services = drug_type.split(',')
    else:
        drug_services = ['16. S. ALT (SGPT)', '01. TLC', '15. S. AST (SGOT)', '03. HGB', '08. DLC']

    if grouping_func == 'monthly':
        query = """ 
SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.drug_name,
        subquery.dr_count
FROM (
        SELECT TO_CHAR(d.drug_exposure_start_date, 'YYYY-MM') AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS drug_id,
                c.concept_name AS drug_name,
                COUNT(*) AS dr_count
        FROM drug_exposure1 AS d
        INNER JOIN visit_occurrence AS v ON COALESCE(d.visit_occurrence_id, 404644)  = v.visit_occurrence_id
        INNER JOIN concept AS c ON d.drug_concept_id = c.concept_id 
        GROUP BY data_month, department, drug_id, drug_name
        ORDER BY data_month
) AS subquery
INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    AND TO_DATE(subquery.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
    AND TO_DATE(subquery.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
    AND care_site.care_site_name = ANY(%s)
ORDER BY subquery.data_month, care_site.care_site_name, subquery.dr_count DESC;
     """
    # -- WHERE subquery.drug_name = ANY(%s)
    elif grouping_func == 'yearly':
        query = """ 
SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.drug_name,
        subquery.dr_count
FROM (
        SELECT TO_CHAR(d.drug_exposure_start_date, 'YYYY') AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS drug_id,
                c.concept_name AS drug_name,
                COUNT(*) AS dr_count
        FROM drug_exposure1 AS d
        INNER JOIN visit_occurrence AS v ON COALESCE(d.visit_occurrence_id, 404644)  = v.visit_occurrence_id
        INNER JOIN concept AS c ON d.drug_concept_id = c.concept_id 
        GROUP BY data_month, department, drug_id, drug_name
        ORDER BY data_month
) AS subquery
INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    AND TO_DATE(subquery.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
    AND TO_DATE(subquery.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
    AND care_site.care_site_name = ANY(%s)
ORDER BY subquery.data_month, care_site.care_site_name, subquery.dr_count DESC;
     """
    # -- WHERE subquery.drug_name = ANY(%s)
    elif(grouping_func=='weekly'):
        query = """ 
SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.drug_name,
        subquery.dr_count
FROM (
        SELECT date_trunc('week',d.drug_exposure_start_date) AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS drug_id,
                c.concept_name AS drug_name,
                COUNT(*) AS dr_count
        FROM drug_exposure1 AS d
        INNER JOIN visit_occurrence AS v ON COALESCE(d.visit_occurrence_id, 404644)  = v.visit_occurrence_id
        INNER JOIN concept AS c ON d.drug_concept_id = c.concept_id 
        GROUP BY data_month, department, drug_id, drug_name
        ORDER BY data_month
) AS subquery
INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    AND subquery.data_month >= %s
    AND subquery.data_month <=%s
    AND care_site.care_site_name = ANY(%s)
ORDER BY subquery.data_month, care_site.care_site_name, subquery.dr_count DESC;
     """
    # -- WHERE subquery.drug_name = ANY(%s)

    drug_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print("data1###############################################")
        # pass drug services names later
        # print(cur.mogrify(query, (drug_services, start_date, end_date, dept_names)).decode('utf-8'))
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        print("###############################################")
        # cur.execute(query, (drug_services, start_date, end_date, dept_names))
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        drug_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'drug Record Name', 'drug Record Count'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return drug_data_1

import psycopg2
import pandas as pd

def fetch_drug_data_2(start_date, end_date, dept_names, grouping_func):

    if grouping_func == 'monthly':
        date_trunc = 'month'
        date_format = 'Mon YYYY'
        query=f"""
SELECT 
to_char(d.drug_exposure_start_date,'YYYY-MM') as date, 
c.care_site_name as departmentname, 
CASE 
	WHEN v.visit_concept_id = 32217 THEN 'Inpatient'
	WHEN v.visit_concept_id = 9203 THEN 'Outpatient'
END AS type,
COUNT(*)  
FROM drug_exposure1 AS d
INNER JOIN visit_occurrence AS v 
ON COALESCE(d.visit_occurrence_id, 404646)= v.visit_occurrence_id
INNER JOIN care_site AS c 
ON c.care_site_id = COALESCE(v.care_site_id, 24473)
WHERE v.visit_concept_id IN (9203, 32217)
AND TO_DATE(TO_CHAR(d.drug_exposure_start_date, 'YYYY-MM'), 'YYYY-MM') >= TO_DATE(%s ,'MM-YYYY')  
AND TO_DATE(TO_CHAR(d.drug_exposure_start_date, 'YYYY-MM'), 'YYYY-MM') <= TO_DATE(%s,'MM-YYYY')  
AND c.care_site_name = ANY(%s)
GROUP BY d.drug_exposure_start_date, c.care_site_name, type
          """
    elif grouping_func == 'weekly':
        date_trunc = 'week'
        date_format = 'DD/MM/YYYY'
        query=f"""
SELECT 
to_char(d.drug_exposure_start_date,'YYYY') as date, 
c.care_site_name as departmentname, 
CASE 
	WHEN v.visit_concept_id = 32217 THEN 'Inpatient'
	WHEN v.visit_concept_id = 9203 THEN 'Outpatient'
END AS type,
COUNT(*)  
FROM drug_exposure1 AS d
INNER JOIN visit_occurrence AS v 
ON COALESCE(d.visit_occurrence_id, 404646)= v.visit_occurrence_id
INNER JOIN care_site AS c 
ON c.care_site_id = COALESCE(v.care_site_id, 24473)
WHERE 
v.visit_concept_id IN (9203, 32217)
AND d.drug_exposure_start_date >=%s  
AND d.drug_exposure_start_date<=%s
AND c.care_site_name = ANY(%s)
GROUP BY d.drug_exposure_start_date, c.care_site_name, type
"""
    elif grouping_func == 'yearly':
        date_trunc = 'year'
        date_format = 'YYYY'
        query=f"""
SELECT 
to_char(d.drug_exposure_start_date,'YYYY') as date, 
c.care_site_name as departmentname, 
CASE 
	WHEN v.visit_concept_id = 32217 THEN 'Inpatient'
	WHEN v.visit_concept_id = 9203 THEN 'Outpatient'
END AS type,
COUNT(*)  
FROM drug_exposure1 AS d
INNER JOIN visit_occurrence AS v 
ON COALESCE(d.visit_occurrence_id, 404646)= v.visit_occurrence_id
INNER JOIN care_site AS c 
ON c.care_site_id = COALESCE(v.care_site_id, 24473)
WHERE v.visit_concept_id IN (9203, 32217)
AND TO_DATE(TO_CHAR(d.drug_exposure_start_date, 'YYYY'), 'YYYY') >= TO_DATE(%s ,'YYYY')  
AND TO_DATE(TO_CHAR(d.drug_exposure_start_date, 'YYYY'), 'YYYY') <= TO_DATE(%s,'YYYY')  
AND c.care_site_name = ANY(%s)
GROUP BY d.drug_exposure_start_date, c.care_site_name, type
          """
    elif grouping_func == 'daily':
        date_trunc = 'day'
        date_format = 'YYYY-MM-DD'
    else:
        raise ValueError("Invalid grouping_func. Choose from 'monthly', 'weekly', 'yearly', or 'daily'.")

    drug_data_2=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.lstrip() for dept in dept_names]
        print("data2###############################################")
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        print("###############################################")
        cur.execute(query, (start_date, end_date, dept_names))
        rows = cur.fetchall()
        
        drug_data_2 = pd.DataFrame(rows, columns=['Date', 'DepartmentName','Type', 'Count'])
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return drug_data_2

def fetch_drug_data_3(start_date, end_date, dept_names, grouping_func):
   
    if grouping_func == 'monthly':
        query = """ 
SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.drug_name,
        subquery.dr_count
FROM (
        SELECT TO_CHAR(d.drug_exposure_start_date, 'YYYY-MM') AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS drug_id,
                c.concept_name AS drug_name,
                COUNT(*) AS dr_count
        FROM drug_exposure1 AS d
        INNER JOIN visit_occurrence AS v ON COALESCE(d.visit_occurrence_id, 404644)  = v.visit_occurrence_id
        INNER JOIN concept AS c ON d.drug_concept_id = c.concept_id 
        GROUP BY data_month, department, drug_id, drug_name
        ORDER BY data_month
) AS subquery
INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    AND TO_DATE(subquery.data_month, 'YYYY-MM') >= TO_DATE(%s, 'MM-YYYY')
    AND TO_DATE(subquery.data_month, 'YYYY-MM') <= TO_DATE(%s, 'MM-YYYY')
    AND care_site.care_site_name = ANY(%s)
ORDER BY subquery.data_month, care_site.care_site_name, subquery.dr_count DESC;
     """
    elif grouping_func == 'yearly':
        query = """ 
SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.drug_name,
        subquery.dr_count
FROM (
        SELECT TO_CHAR(d.drug_exposure_start_date, 'YYYY') AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS drug_id,
                c.concept_name AS drug_name,
                COUNT(*) AS dr_count
        FROM drug_exposure1 AS d
        INNER JOIN visit_occurrence AS v ON COALESCE(d.visit_occurrence_id, 404644)  = v.visit_occurrence_id
        INNER JOIN concept AS c ON d.drug_concept_id = c.concept_id 
        GROUP BY data_month, department, drug_id, drug_name
        ORDER BY data_month
) AS subquery
INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    AND TO_DATE(subquery.data_month, 'YYYY') >= TO_DATE(%s, 'YYYY')
    AND TO_DATE(subquery.data_month, 'YYYY') <= TO_DATE(%s, 'YYYY')
    AND care_site.care_site_name = ANY(%s)
ORDER BY subquery.data_month, care_site.care_site_name, subquery.dr_count DESC;
     """
    elif(grouping_func=='weekly'):
        query=f"""
SELECT subquery.data_month AS data_date,
        care_site.care_site_name AS dept_name,
        subquery.drug_name,
        subquery.dr_count
FROM (
        SELECT date_trunc('week',d.drug_exposure_start_date) AS data_month,
                COALESCE(v.care_site_id, 24473) AS department,
                c.concept_id AS drug_id,
                c.concept_name AS drug_name,
                COUNT(*) AS dr_count
        FROM drug_exposure1 AS d
        INNER JOIN visit_occurrence AS v ON COALESCE(d.visit_occurrence_id, 404644)  = v.visit_occurrence_id
        INNER JOIN concept AS c ON d.drug_concept_id = c.concept_id 
        GROUP BY data_month, department, drug_id, drug_name
        ORDER BY data_month
) AS subquery
INNER JOIN care_site ON subquery.department = care_site.care_site_id 
    AND subquery.data_month >= %s
    AND subquery.data_month <=%s
    AND care_site.care_site_name = ANY(%s)
ORDER BY subquery.data_month, care_site.care_site_name, subquery.dr_count DESC;
"""
    
    drug_data_1 = pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        dept_names = [dept.strip() for dept in dept_names]
        print("data3###############################################")
        print(cur.mogrify(query, (start_date, end_date, dept_names)).decode('utf-8'))
        print("###############################################")
        cur.execute(query, ( start_date, end_date, dept_names))
        rows = cur.fetchall()
        drug_data_1 = pd.DataFrame(rows, columns=['Date', 'DepartmentName', 'drug Record Name', 'drug Record Count'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
    return drug_data_1

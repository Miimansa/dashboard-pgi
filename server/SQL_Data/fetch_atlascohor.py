import psycopg2
import pandas as pd
from config import Config
db_params = {
        'dbname': Config.DB_NAME,
        'user': Config.DB_USER,
        'password': Config.DB_PASSWORD,
        'host': Config.DB_HOST
    }

def fetch_person_data(limit):
    query=f""" 
select person_id, year_of_birth , GREATEST(21, EXTRACT(YEAR FROM CURRENT_DATE) - year_of_birth) as age, gender_source_value,person_source_value from  person limit %s
""" 
    person_data=pd.DataFrame()
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        print(f"Executed query:")
        print(limit)
        print(cur.mogrify(query, (int(limit),)).decode('utf-8'))
        cur.execute(query, (int(limit),))
        rows = cur.fetchall()
        person_data = pd.DataFrame(rows, columns=['Person_id','Year_of_birth','Age','Gender_source_value','Person_source_value'])
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    return person_data

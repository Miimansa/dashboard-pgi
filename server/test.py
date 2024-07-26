# import necessary modules
import psycopg2


def run_query(query):
    # Define the database connection parameters
    db_params = {
        'dbname': 'pgi_data',
        'user': 'ayush',
        'password': 'aysh7139',
        'host': 'localhost'
    }

    conn = None
    cur = None
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        
        # Execute the query
        cur.execute(query)
        
        # Fetch all rows from the executed query
        rows = cur.fetchall()
        
        # Print the fetched rows
        for row in rows:
            print(row)
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    table_name = "user"

    # Create the SQL query string with the table name in double quotes
    query = f'SELECT * FROM "{table_name}"'

    # Run the query and print the results
    run_query(query)

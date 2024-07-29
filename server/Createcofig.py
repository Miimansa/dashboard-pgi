import os

def get_input(prompt, default=None):
    value = input(f"{prompt} [{default}]: ").strip()
    return value if value else default

def generate_config():
    config_template = '''import os

class Config:
    DB_NAME = '{db_name}'
    DB_USER = '{db_user}'
    DB_PASSWORD = '{db_password}'
    DB_HOST = '{db_host}'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = '{mail_username}'
    MAIL_PASSWORD = '{mail_password}'
    MAIL_DEFAULT_SENDER = '{mail_default_sender}'
    HOME_DATA_PATH = 'data/home_data.json'
    LAB_DATA_PATH = 'data/lab_data.json'
    RESOURCES_DATA_PATH = 'data/resources_data.json'
    EMERGENCY_DATA_PATH = 'data/emergency_data.json'
    DISEASE_DATA_PATH = 'data/disease_data.json'
    JWT_SECRET_KEY = 'abc'
'''

    print("Please enter the following configuration values:")
    mail_username = get_input("MAIL_USERNAME", 'dev.miimansa@gmail.com')
    mail_password = get_input("MAIL_PASSWORD", 'ygus enyp fvdm bhzp')
    mail_default_sender = get_input("MAIL_DEFAULT_SENDER", 'dev.miimansa@gmail.com')
    db_name = get_input("DB_NAME", 'pgi_data')
    db_user = get_input("DB_USER", 'ayush')
    db_password = get_input("DB_PASSWORD", 'aysh7139')
    db_host = get_input("DB_HOST", 'localhost')

    config_content = config_template.format(
        mail_username=mail_username,
        mail_password=mail_password,
        mail_default_sender=mail_default_sender,
        db_name=db_name,
        db_user=db_user,
        db_password=db_password,
        db_host=db_host
    )

    with open('config.py', 'w') as config_file:
        config_file.write(config_content)

    print("config.py has been generated successfully.")

if __name__ == "__main__":
    generate_config()
import os

def get_user_info():
    try:
        username = os.getlogin()
    except OSError:
        username = "Unknown"
    
    userdomain = os.environ.get('USERDOMAIN', 'Unknown')
    return username, userdomain
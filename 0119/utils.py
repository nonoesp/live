import re
from datetime import datetime

def ddyymm_hhmmss():
    return datetime.today().strftime('%y%m%d_%H%M%S')

def clean_prompt(prompt):
    # Remove invalid filename characters
    clean_prompt = re.sub(r'\',[<>:"/\\|?*]', '', prompt)
    # Replace spaces with underscores
    clean_prompt = re.sub(r'\s+', '_', clean_prompt)
    # Optionally, truncate to avoid very long filenames
    clean_prompt = clean_prompt[:255]
    return clean_prompt
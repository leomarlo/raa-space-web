from caldav import DAVClient
from datetime import datetime, timezone
from pathlib import Path
import os
from dotenv import load_dotenv
# Get the parent of the current working directory
env_path = Path.cwd().parent / '.env'
print(env_path)
# Load .env from that path
load_dotenv(dotenv_path=env_path)

MAILBOX_PASSWORD = os.getenv('MAILBOX_PASSWORD')
MAILBOX_CAL_DAV_CREDENTIAL = os.getenv('MAILBOX_CAL_DAV_CREDENTIAL')
if not MAILBOX_PASSWORD or not MAILBOX_CAL_DAV_CREDENTIAL:
    raise ValueError('MAILBOX_PASSWORD or MAILBOX_CAL_DAV_CREDENTIAL is not set')

# Connect to mailbox.org
client = DAVClient(
    url=f"https://dav.mailbox.org/caldav/{MAILBOX_CAL_DAV_CREDENTIAL}",
    username="enter@raa.space",
    password=MAILBOX_PASSWORD
)

# Get principal (your user account)
principal = client.principal()

# List calendars
calendars = principal.calendars()
calendar = calendars[0]  # Select the default calendar

# Create an event (ICS format)
dtstamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
ics = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp.//CalDAV Client//EN
BEGIN:VEVENT
UID:jana-cooks-lunch-{dtstamp}
DTSTAMP:{dtstamp}
DTSTART:20250615T140000Z
DTEND:20250615T150000Z
SUMMARY:Jana cucina il pranzo.
DESCRIPTION:This event is very important.
END:VEVENT
END:VCALENDAR
"""

# Save event
event = calendar.add_event(ics)
print(event)
print("--------------------------------")
print(event.url)

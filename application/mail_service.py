from smtplib import SMTP #used to create smtp client
from email.mime.multipart import MIMEMultipart #mime type declares what is content type of message in the email . multipart:message will have multiple parts
from email.mime.text import MIMEText #another mime type ,used to create a message used type is text/html(our case) or text/plain

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'tamanna@study.iitm.ac.in'
SENDER_PASSWORD = ''


def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html')) #content type text/html
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

# send_message('tamanna@gmail.com','test','<html>Email Test</html>')

def send_email(to_address, subject, message, content_type='html'):
    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_address
    msg["Subject"] = subject
    msg.attach(MIMEText(message, content_type))

    try:
        client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
        # If your SMTP server requires authentication
        # client.login(SENDER_EMAIL, SENDER_PASSWORD)
        client.send_message(msg)
        client.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {str(e)}")
    
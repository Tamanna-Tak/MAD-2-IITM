from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db,User,Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel 
from celery.schedules import crontab
from application.tasks import daily_reminder,reminder_via_email,chat_reminder

def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)#tell main flask application that we are usimg sql alchemy
    api.init_app(app)
    excel.init_excel(app)
    app.security=Security(app,datastore)
    with app.app_context():
        import application.views
    return app

app =create_app()
celery_app=celery_init_app(app)
##      daily reminder task
# @celery_app.on_after_configure.connect
# def send_email(sender, **kwargs):
#     sender.add_periodic_task(
#         crontab(hour=12, minute=44, day_of_week=2), #remove day_of_week if want to send everyday, also use day_of_month
#         daily_reminder.s("To@email.com",'SUBJECT:Daily test'),
#     )

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
   sender.add_periodic_task(
        crontab(hour=14, minute=5,day_of_month='30'),
        reminder_via_email.s(),
    )
   

@celery_app.on_after_configure.connect
def send_chat(sender, **kwargs):
   sender.add_periodic_task(
        crontab(hour=16, minute=56,day_of_month='29'),
        chat_reminder.s(),
    )

if __name__=='__main__':
    app.run(debug=True)
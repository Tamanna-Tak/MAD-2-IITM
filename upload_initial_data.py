#fixed data , ex:Roles Data
from main import app
from application.sec import datastore
from application.models import db,Role
from datetime import datetime
# from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context(): #access of all application level data
        db.create_all() #create all the tables

        ###  Adding data to database ##########

        ## while registration:
        ## email and passworg come from client(here hardcodded)
        ## if we are sending the role while creating user from the frontend and check what it is and use the resp :..if not datastore.find_user(email="stud@email.com").....or for inst(active=False)part code .......

        datastore.find_or_create_role(name="admin", description="User is an admin")#if not find admin role create admin role(in role table)
        datastore.find_or_create_role(name="man", description="User is an Manager")
        datastore.find_or_create_role(name="user", description="User is an Normal User")

        db.session.commit()
        if not datastore.find_user(email="admin@email.com"):#if admin is not in database
                admin=datastore.create_user(email="admin@email.com",username="admin", password=generate_password_hash("admin"), roles=["admin"])#create user in user table
                admin.login_time = datetime.utcnow()     
                        #only below part details from client , above can be hard coded
        if not datastore.find_user(email="man1@email.com"):
                manager=datastore.create_user(email="man1@email.com", username="manager",password=generate_password_hash("man1"), roles=["man"], active=False)
                manager.login_time = datetime.utcnow()
        if not datastore.find_user(email="user1@email.com"):
                user=datastore.create_user(email="user1@email.com",username="Normal_user", password=generate_password_hash("user1"), roles=["user"])
                user.login_time = datetime.utcnow()
        db.session.commit()
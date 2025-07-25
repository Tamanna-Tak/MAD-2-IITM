from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()
from datetime import datetime

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False,nullable=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    login_time = db.Column(db.DateTime, default=datetime.utcnow)  # 
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    categories=db.relationship('Category',backref='creator')


class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)
    is_delete = db.Column(db.Boolean(), default=False)
    edit_requested = db.Column(db.Boolean(), default=False)
    is_approved_edit = db.Column(db.Boolean(), default=False)
    

class Product(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    unit = db.Column(db.String, nullable=False)
    rate_per_unit=db.Column(db.Integer, nullable=False)
    quantity=db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship('Category', backref='products', lazy=True)

class UserCart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)   
    

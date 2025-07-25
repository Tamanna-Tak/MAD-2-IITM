# MAD-2-IITM: **Grocery Store**
## DESCRIPTION 
The Grocery store is a multi-user app web-based platform designed to facilitate the management of 
categories and product by admin and store manager, also enable customer (end user) to order 
products. 

## TECHNOLOGY USED: 
* Flask for creating API
* VueJS for UI
* SQLite for creating database
* Redis for caching
* Redis and Celery for batch jobs

## DATABASE SCHEMA: 
The database stores the details about Categories, Products, Users, UserCart, and relationship 
between them.  

## FEATURES OF APPLICATION: 
#### * User signup and login 
#### * Admin Login
#### * Store Manager Signup and Login : 
Every new store manager sign up should be approved by the admin
#### * Section/Category Management :
Create, Edit, Remove a section/category 
#### * Product management 
Create ,Edit , Remove a product , Allocate section/category while creating products
#### * Search for products
#### * Shopping Cart for User
#### * Daily reminders on Google Chat using webhook
#### * Monthly Activity Report
#### * download the product details 
#### * Performance and Caching 

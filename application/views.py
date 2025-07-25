from flask import current_app as app , jsonify,request,render_template,send_file
from flask_security import auth_required, roles_required,roles_accepted#auth_required:for authentication
from flask_restful import marshal, fields
import flask_excel as excel
from datetime import datetime
from celery.result import AsyncResult
from .models import User,db,Role,Category,Product
from .sec import datastore
from werkzeug.security import check_password_hash,generate_password_hash
from .tasks import create_resource_csv




@app.get('/')
def home():
    return render_template("index.html")

@app.get('/admin')
@auth_required("token")#token based authentication(user should be admin)
@roles_required("admin")#(user shoud be admin not other role)
def admin():
    return "Welcome Admin"

########## Whenever user try to register as an instructor ###################
@app.get('/activate/man/<int:man_id>')
@auth_required("token")
@roles_required("admin")#only admin can use this endpoint/url
def activate_manager(man_id):
    manager=User.query.get(man_id)
    if not manager or "man" not in manager.roles:
        return jsonify({"message":"manager not found"}),404
    manager.active=True
    db.session.commit()
    return jsonify({"message":"User Activated"})


@app.post('/user-login')
def user_login():
    data=request.get_json()#it give dictionary
    email=data.get('email')
    if not email:
        return jsonify({'message':'Email not provided'}),400
    
    user=datastore.find_user(email=email)

    if not user:
        return jsonify({'message': 'User not found'}),404
    
    if check_password_hash(user.password,data.get("password")):
        user.login_time = datetime.utcnow()
        db.session.commit() 
        return jsonify({"token":user.get_auth_token(),"user_id":user.id,"email":user.email,"role":user.roles[0].name})
    
    else:
        return jsonify({'message':"Wrong password"}),400
    

@app.post('/user-register')
def user_register():
    data = request.get_json()  # Retrieves JSON data sent from the client
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # Assuming the role is sent from the client

    if not email or not password or not role:
        return jsonify({'message': 'Email, password, or role not provided'}), 400

    existing_user = datastore.find_user(email=email)
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409  # Conflict status code

    # Create a new user with the provided email, password, and role
    new_user =  datastore.create_user(email=email, password=generate_password_hash(password), active=True)

    if role == 'man':
        # For users with role 'man', set active=False initially for admin approval
        new_user.active = False

    new_user.roles.append(Role.query.filter_by(name=role).first())  # Assign the role to the user

    db.session.add(new_user)
    db.session.commit()

    if new_user.active:
        return jsonify({'message': 'User registered and activated successfully'}), 201  # Created status code
    else:
        return jsonify({'message': 'User registered. Waiting for admin approval'}), 202  # Accepted status code



user_fields={
    "id":fields.Integer,
    "email":fields.String,
    "active":fields.Boolean

}

@app.get('/users')
@auth_required("token")
@roles_required("admin")
def all_users():
    users=User.query.all()
    if len(users)==0:
        return jsonify({'message':"No User Found"}),404
    return marshal(users,user_fields) # dictionary type


@app.get("/category/<int:id>/approve")
@auth_required("token")
@roles_required("admin")
def resource(id):
    category=Category.query.get(id)
    if not category:
        return jsonify({'message':"Category not found"}),404
    category.is_approved=True
    print("created:",category)
    db.session.commit()
    return jsonify({"message":"Approved"})

@app.get("/category/<int:id>/request_delete")
@auth_required("token")
@roles_required("man")
def request_category_deletion(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'message': "Category not found"}), 404
    if category.is_approved:
        print(category)
        category.is_delete = True
        db.session.commit()
        return jsonify({"message": "Deletion requested for the category"})
    else:
        return jsonify({"message": "Category is not approved"})
    
@app.get("/category/<int:id>/delete")
@auth_required("token")
@roles_required("admin")
def delete_category(id):
    category = Category.query.get(id)
    
    if not category:
        return jsonify({'message': "Category not found"}), 404
    
    if category.is_delete:
        Product.query.filter_by(category_id=id).delete()
        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully on Request"})
    else:
        Product.query.filter_by(category_id=id).delete()
        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully"})
    

@app.put("/category/<int:id>/edit_request")
@auth_required("token")
@roles_required("man")
def edit_category_request(id):
    cat = Category.query.get(id)
    if not cat:
        return jsonify({'message': "Category not found"}), 404
    else:
        cat.edit_requested = True
        db.session.commit()
        return jsonify({"message": "Edit request sent successfully"})



@app.put("/category/<int:id>/approve_edit")
@auth_required("token")
@roles_required("admin")
def approve_edit_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'message': "Category not found"}), 404

    # Logic for admin to approve the edit request
    if category.edit_requested:
        category.edit_requested = False  # Reset edit request flag
        category.is_approved_edit = True  # Set approval flag for edit
        db.session.commit()
        return jsonify({"message": "Edit request approved"})
    else:
        return jsonify({"message": "No edit request found"})
    

@app.put("/category/<int:id>/edit")
@auth_required("token")
@roles_required("man")
def edit_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'message': "Category not found"}), 404

    if category.is_approved_edit:
        category.name = request.json.get('name', category.name)
        category.description = request.json.get('description', category.description)
        category.edit_requested=False
        category.is_approved_edit = False
        db.session.commit()
        return jsonify({"message": "Category edited successfully"})
    else:
        return jsonify({"message": "Category edit is not approved"})
    
@app.put("/admin/category/<int:id>/edit")
@auth_required("token")
@roles_required("admin")
def edit_category_by_admin(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'message': "Category not found"}), 404

    if category:
        category.name = request.json.get('name', category.name)
        category.description = request.json.get('description', category.description)
        db.session.commit()
        return jsonify({"message": "Category edited successfully"})
    else:
        return jsonify({"message": "Category edit not possible"})

from flask import jsonify

@app.get("/category/<int:id>/products")
@auth_required("token")
@roles_accepted("man","user")
def get_products_by_category(id):
    category = Category.query.get(id)
    print(category)
    if not category:
        return jsonify({'message': "Category not found"}), 404

    products = category.products  # Assuming 'products' is the relationship backref in Category model

    if products:
        product_list = [
            {
                "id": product.id,
                "name": product.name,
                "unit": product.unit,
                "rate_per_unit": product.rate_per_unit,
                "quantity": product.quantity
                # Add other product fields as needed
            }
            for product in products
        ]
        return jsonify({"products": product_list})
    else:
        return jsonify({"message": "No products found for this category"})
    



@app.get("/product/<int:id>/delete")
@auth_required("token")
@roles_required("man")
def delete_product(id):
    product = Product.query.get(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "product deleted successfully"})
    

@app.put("/product/<int:id>/edit")
@auth_required("token")
@roles_required("man")
def edit_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'message': "Product not found"}), 404
    
    product.name = request.json.get('name', product.name)
    product.unit = request.json.get('unit', product.unit)
    product.rate_per_unit = request.json.get('rate_per_unit', product.rate_per_unit)
    product.quantity = request.json.get('quantity', product.quantity)
    product.category_id = request.json.get('category_id', product.category_id)

    db.session.commit()
    return jsonify({"message": "Product edited successfully"})


@app.get("/product/search/<int:min>/<int:max>")
def search_products_by_price(min,max):
    # min_price = request.args.get('min_price')
    # max_price = request.args.get('max_price')

    try:
        min = float(min) if min else 0.0
        max = float(max) if max else float('inf')

        # Query products based on the price range
        products = Product.query.filter(Product.rate_per_unit.between(min, max)).all()

        # Convert products to JSON or manipulate the data before returning as needed
        products_json = [{'name': product.name, 'unit': product.unit, 'rate_per_unit': product.rate_per_unit} for product in products]

        return jsonify({'products': products_json}), 200
    except ValueError:
        return jsonify({'message': 'Invalid price range format or values provided'}), 400
    
###  Export/Download Jobs #########
@app.get('/download-csv') 
def download_csv():
    task=create_resource_csv.delay()
    return jsonify({"task-id":task.id})


@app.get('/get-csv/<task_id>')
def get_csv(task_id) :
    res=AsyncResult(task_id)
    if res.ready(): 
        filename=res.result 
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"message":"Task pending"}),404
    
#####################

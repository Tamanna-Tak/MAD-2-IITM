from flask_restful import Resource,Api,reqparse,fields,marshal
from flask_security import auth_required,roles_required,current_user,roles_accepted
from sqlalchemy import or_
from time import sleep
from .models import Category,db,Product,UserCart
from flask_caching import Cache
cache=Cache()

api=Api(prefix='/api')#api instance

parser=reqparse.RequestParser()#when some client is sending request it parse the request object and give a dictionary
parser.add_argument('name', type=str, help='Name is required and should be a string',required=True)
parser.add_argument('description', type=str, help='Description is required and should be a string',required=True)

product_parser = reqparse.RequestParser()
product_parser.add_argument('name', type=str, help='Name is required and should be a string', required=True)
product_parser.add_argument('unit', type=str, help='Unit is required and should be a string', required=True)
product_parser.add_argument('rate_per_unit', type=int, help='Rate per unit is required and should be a integer', required=True)
product_parser.add_argument('quantity', type=int, help='Quantity is required and should be an integer', required=True)
product_parser.add_argument('category_id', type=int, help='Category ID is required and should be a integer', required=True)

cart_parser=reqparse.RequestParser()
cart_parser.add_argument('category_id', type=int, help='category_id is required and should be a integer', required=True)
cart_parser.add_argument('product_id', type=int, help='product_id is required and should be a integer', required=True)
cart_parser.add_argument('user_id', type=int, help='user_idis required and should be a int', required=True)
cart_parser.add_argument('quantity', type=int, help='Quantity is required and should be an integer', required=True)

class Creator(fields.Raw): 
    def format(self ,user):
        return user.email



section_fields = {
    'id':fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'is_approved':fields.Boolean,
    'creator':Creator,
    'is_delete':fields.Boolean,
    'edit_requested':fields.Boolean,
    'is_approved_edit':fields.Boolean
    
}
user_section_field={
    'id':fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'is_approved':fields.Boolean,
}

product_fields={
   'id':fields.Integer,
    'name': fields.String,
    'unit':fields.String,
    'rate_per_unit':fields.Integer,
    'quantity':fields.Integer,
    'category_id':fields.Integer
}

cart_field={
    'id':fields.Integer,
    'user_id':fields.Integer,
    'product_id':fields.Integer,
    'category_id':fields.Integer,
    'quantity':fields.Integer
}

#creating resource
class Section(Resource):
    @auth_required("token")
    def get(self):
        # all_section=Category.query.all()
        if "admin" in current_user.roles:
            category=Category.query.all()
            
        else:
            category = Category.query.filter(
                or_(Category.is_approved == True, Category.creator == current_user)).all()
            
        if len(category) > 0:
            return marshal(category, section_fields)
        else:
            return {"message": "No Resourse Found"}, 404
    

    @auth_required("token")
    @roles_accepted("man","admin")
    def post(self):       #create study material
        args = parser.parse_args()#three keys topic ,description,link .used to crete a study_material resourse
        
        categories=Category(name=args.get("name"),description=args.get("description"),creator_id=current_user.id)#unpack args
        db.session.add(categories)
        db.session.commit()
        return {"message":"Category created"}
    

class Products(Resource):
    @auth_required("token")
    # @cache.cached(timeout=50)  
    def get(self, id=None):
        # Check if product_id is provided in the request
        if id:
            # Fetch a specific product by its ID
            product = Product.query.get(id)

            if product:
                return marshal(product, product_fields)
            else:
                return {"message": "Product not found"}, 404
        else:
            products = Product.query.all()

            if len(products) > 0:
                # sleep(10)
                return marshal(products, product_fields)
            else:
                return {"message": "No Products Found"}, 404



    @auth_required("token")
    @roles_required("man")
    def post(self):
        args = product_parser.parse_args()
        print("args", args)  
        
        category = Category.query.get(args.get("category_id"))
        if category:
            product = Product(
                name=args.get("name"),
                unit=args.get("unit"),
                rate_per_unit=args.get("rate_per_unit"),
                quantity=args.get("quantity"),
                category_id=category.id  
            )
    
        db.session.add(product)
        db.session.commit()

        return {"message": "Product created"}


class Cart(Resource):
    @auth_required("token")
    @roles_required("user")
    def post(self):
        args = cart_parser.parse_args()
        user_id = current_user.id
        product_id = args.get("product_id")
        category_id = args.get("category_id")
        quantity = args.get("quantity")

      
        product = Product.query.get(product_id)


        if product.quantity >= quantity:
            product.quantity -= quantity
            db.session.commit()

            cart = UserCart(user_id=user_id, product_id=product_id, category_id=category_id, quantity=quantity)
            db.session.add(cart)
            db.session.commit()

            return ({"message": "Item added to cart successfully"})
        else:
            return ({"message": "Insufficient quantity available"})
    
    
    @auth_required("token")
    @roles_required("user")
    def get(self, user_id):
        cart_items = UserCart.query.filter_by(user_id=user_id).all()
        if cart_items:
            # List to store formatted product details
            formatted_cart = []

            for item in cart_items:
                product = Product.query.get(item.product_id)
                if product:
                    # Create a dictionary containing necessary product details
                    product_details = {
                        'cart_id':item.id,
                        'product_name': product.name,
                        'product_unit': product.unit,
                        'rate_per_unit': product.rate_per_unit,
                        'cart_quantity': item.quantity
                    }
                    formatted_cart.append(product_details)

            if formatted_cart:
                return formatted_cart, 200
            else:
                return {"message": "No items found in the cart"}, 404
        else:
            return {"message": "Cart is empty"}, 404
        

    @auth_required("token")
    @roles_required("user")
    def delete(self,item_id):
        try:
            item = UserCart.query.get(item_id)
            if not item:
                return ({"message": f"Item with ID {item_id} not found in the cart."}), 404

            # Get the product associated with the cart item
            product = Product.query.get(item.product_id)
            if not product:
                return ({"message": "Product not found."}), 404

            # Update quantities
            product.quantity += item.quantity  # Increment product quantity
            db.session.delete(item)  # Remove the item from the cart
            db.session.commit()

            return ({"message": f"Item with ID {item_id} removed from the cart."}), 200
        except Exception as e:
            db.session.rollback()
            return ({"message": f"Error: {str(e)}"}), 500




api.add_resource(Cart,'/cart/add','/cart/item/<int:user_id>','/cart/remove/<int:item_id>')
api.add_resource(Section,'/section')
api.add_resource(Products,'/product' ,'/product/<int:id>')

from celery import shared_task
from .models import Product,User,UserCart
from httplib2 import Http
import flask_excel as excel
from .mail_service import send_message,send_email
from jinja2 import Template
from flask import render_template_string
from datetime import datetime,timedelta


@shared_task(ignore_result=False) 
def create_resource_csv():
    stud_res=Product.query.all()
    csv_output=excel.make_response_from_query_sets(stud_res,["id","name","unit","rate_per_unit","quantity","category_id"],"csv",filename="test1.csv") 
   
    filename="test.csv"

    with open(filename,'wb') as f: 
        f.write(csv_output.data)

    return filename


@shared_task(ignore_result=True)
def daily_reminder(to,subject):
        send_message(to,subject,"hello")

        return "OK"


@shared_task(ignore_result=True)
def reminder_via_email():
    users = User.query.all()

    for user in users:
        cart_items = UserCart.query.filter_by(user_id=user.id).all()
        if cart_items:
            cart_details = []
            total_transaction_amount = 0  # Initialize total transaction amount
            for cart_item in cart_items:
                product = Product.query.get(cart_item.product_id)
                if product:
                    cart_details.append({
                        'product_name': product.name,
                        'unit': product.unit,
                        'rate_per_unit': product.rate_per_unit,
                        'cart_quantity': cart_item.quantity
                    })
                    total_transaction_amount += (product.rate_per_unit * cart_item.quantity)

            email_content = render_template_string(
                """
                <html>
                <head>
                    <style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            text-align: left;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    <h2>Your Recent Order Details</h2>
                     <h4 style="color:DarkBlue" >Unique UserID : {{ user.id }}</h4>
                    <h4 style="color:DarkBlue">Username : {{ user.username }}</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Product Name</th>
                                <th scope="col">Unit</th>
                                <th scope="col">Rate per Unit</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in cart_details %}
                                <tr>
                                    <td>{{ item.product_name }}</td>
                                    <td>{{ item.unit }}</td>
                                    <td>{{ item.rate_per_unit }}</td>
                                    <td>{{ item.cart_quantity }}</td>
                                </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                    <h5 style="color:green;text-align:center">
                        Total Transaction Amount: {{ total_transaction_amount }}
                    </h5>
                </body>
                </html>
                """,
                user=user,
                cart_details=cart_details,
                total_transaction_amount=total_transaction_amount,  # Pass total amount to the template
            )

            send_email(
                to_address=user.email,
                subject="Your Recent Booking Details",
                message=email_content,
                content_type="html",
            )
    
    return "Reminder emails sent successfully"


@shared_task(ignore_result=True)
def chat_reminder():
    from json import dumps
    """Google Chat incoming webhook quickstart."""
    url = os.getenv("GOOGLE_CHAT_WEBHOOK_URL")
    # users =User.query.filter(User.roles.any(name='user'),User.login_time < (datetime.utcnow() - timedelta(minutes=1))).all()
    users =User.query.filter(User.roles.any(name='user'),User.login_time < (datetime.utcnow() - timedelta(minutes=1))).all()
    # users =User.query.all()
    for user in users:
        
            app_message = {
                'text': f"Hello {user.username}.. We noticed you haven't visited our grocery store app recently. and wanted to remind you of the amazing deals waiting just for you!"
            }
            message_headers = {"Content-Type": "application/json; charset=UTF-8"}
            http_obj = Http()
            response = http_obj.request(
                uri=url,
                method="POST",
                headers=message_headers,
                body=dumps(app_message),
            )
            print("Response...................",response)
    return "Remainder will be sent shortly"

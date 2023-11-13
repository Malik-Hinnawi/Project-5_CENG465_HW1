import random
import json
import datetime
import bcrypt

def create_order():
    random_customer = customer_array[random.randint(0, len(customer_array)-1)]
    random_product = product_array[random.randint(0, len(product_array)-1)]
    

customer_array, product_array = None, None

with open("customers.json", "r", encoding="utf-8") as customers:
    with open("products.json", "r", encoding="utf-8") as products:
        customer_array = json.load(customers)
        product_array = json.load(products)


create_random_orders(30)
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    mongo = current_app.mongo
    users = mongo.db.users

    if users.find_one({"username": data["username"]}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = generate_password_hash(data["password"])
    users.insert_one({"username": data["username"], "password": hashed_pw})
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    mongo = current_app.mongo
    user = mongo.db.users.find_one({"username": data["username"]})

    if user and check_password_hash(user["password"], data["password"]):
        token = jwt.encode({
            "username": user["username"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, current_app.config["SECRET_KEY"], algorithm="HS256")

        return jsonify({"token": token})
    else:
        return jsonify({"error": "Invalid username or password"}), 401

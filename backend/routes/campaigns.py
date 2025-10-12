from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
import jwt

campaigns_bp = Blueprint("campaigns", __name__)

def verify_token(req):
    token = req.headers.get("Authorization")
    if not token:
        return None
    try:
        decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        return decoded
    except:
        return None

@campaigns_bp.route("/", methods=["GET", "POST"])
def campaigns():
    mongo = current_app.mongo
    collection = mongo.db.campaigns

    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if request.method == "POST":
        data = request.get_json()
        required = ["campaign_name", "client_name", "status", "start_date"]
        if not all(f in data and data[f] for f in required):
            return jsonify({"error": "Missing fields"}), 400
        data["user"] = user["username"]
        result = collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return jsonify(data), 201

    campaigns = []
    for c in collection.find({"user": user["username"]}):
        c["_id"] = str(c["_id"])
        campaigns.append(c)
    return jsonify(campaigns)

@campaigns_bp.route("/<id>", methods=["DELETE", "PUT"])
def modify_campaign(id):
    mongo = current_app.mongo
    collection = mongo.db.campaigns
    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if request.method == "DELETE":
        result = collection.delete_one({"_id": ObjectId(id), "user": user["username"]})
        if result.deleted_count == 0:
            return jsonify({"error": "Not found"}), 404
        return jsonify({"message": "Deleted"}), 200

    if request.method == "PUT":
        data = request.get_json()
        collection.update_one({"_id": ObjectId(id), "user": user["username"]}, {"$set": data})
        return jsonify({"message": "Updated"}), 200

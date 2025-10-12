from flask import Flask, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.campaigns import campaigns_bp

def create_app():
    app = Flask(__name__, static_folder="../frontend", static_url_path="/")
    app.config.from_object(Config)
    CORS(app)
    mongo = PyMongo(app)
    app.mongo = mongo

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(campaigns_bp, url_prefix="/api/campaigns")

    @app.route("/")
    def index():
        return send_from_directory(app.static_folder, "login.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)

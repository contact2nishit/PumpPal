from flask import Flask, request, jsonify
from flask_cors import CORS
from db_interactions import connect
from bcrypt import hashpw, gensalt, checkpw
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import dotenv, os
import datetime


app = Flask(__name__)
dotenv.load_dotenv()
CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=100000)
jwt = JWTManager(app)


@app.route("/users", methods=['POST'])
def add_user():
    req = request.get_json()
    username = req.get("username")
    email = req.get("email")
    password = req.get('password')
    if not username or not email or not password:
        return jsonify({"message": "no username, pwd, or email"}), 400
    try: 
        with connect() as conn:
            with conn.cursor() as curs:
                curs.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
                user = curs.fetchone()
                if user: 
                    return jsonify({"message": "already exists"}), 409
                hash = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')
                curs.execute("INSERT INTO users(username, email, password_hash) VALUES(%s, %s, %s)", (username, email, hash))
                conn.commit()
                return jsonify({"message": "user added"}), 201
    except Exception:
        return jsonify({"message": "something is wrong"}), 500


@app.route("/login", methods=['POST'])
def login():
    req = request.get_json()
    username = req.get("username")
    password = req.get("password")
    if not username or not password:
        return jsonify({"error": "no username or pwd"}), 400
    try:
        with connect() as conn:
            with conn.cursor() as curs:
                curs.execute("SELECT id, password_hash FROM users WHERE username = %s", (username,))
                hashed = curs.fetchone()
                if not hashed:
                    # user not found
                    return jsonify({"error": "Invalid Credentials"}), 401
                id, hashedpw = hashed
                if checkpw(password.encode('utf-8'), hashedpw.encode('utf-8')):
                    access_token = create_access_token(identity=id)
                    return jsonify({"token": access_token}), 201
                else:
                    # wrong pw
                    return jsonify({"error": "Invalid Credentials"}), 401
    except Exception as e:
        print(e)
        return jsonify({"error": "something is wrong"}), 500
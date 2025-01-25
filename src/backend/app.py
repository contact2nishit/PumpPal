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
    
# Returns all templates for a user: dict with each template name as key and a dict containing exercises (string list), sets (list of int), templateID (int), and exerciseIDs (list)
@app.route("/templates/fetch", methods=['GET'])
@jwt_required()
def get_templates():
    user = get_jwt_identity()
    try: 
        with connect() as conn:
            with conn.cursor() as curs:
                # select all templates for user
                curs.execute("SELECT template_id, template_name FROM templates WHERE user_id = %s", (user,))
                templates = curs.fetchall() # templates[i][0] is template_id, templates[i][1] is template_name
                if not templates:
                    return jsonify({"error": "no templates"}), 404
                exercises = []
                ids = []
                sets = []
                tids = []
                for template in templates:
                    # pick all exercises (with default set number and name) for each template_id
                    curs.execute("SELECT ex, default_num_sets FROM template_exercises WHERE template_id = %s", (template[0],))
                    tids.append(template[0])
                    # ex is foreign key to exercise_list table
                    resp = curs.fetchall()
                    ex_for_this_template = []
                    ex_ids_for_this_template = []
                    for r in resp:
                        curs.execute("SELECT ex_name FROM exercise_list WHERE ex_id = %s", (r[0],))
                        name = curs.fetchone()
                        ex_for_this_template.append(name[0])
                        ex_ids_for_this_template.append(r[0])
                    exercises.append(ex_for_this_template)
                    ids.append(ex_ids_for_this_template)
                    sets.append([r[1] for r in resp])
                templates_ret = {}
                for i in range(len(templates)):
                    templates_ret = templates_ret | {templates[i][1]: \
                                                        {
                                                            "exercises": exercises[i],
                                                            "sets": sets[i],
                                                            "templateID": tids[i],
                                                            "exerciseIDs": ids[i],
                                                        }
                                                    }                       
                return jsonify(templates_ret), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "something is wrong"}), 500

@app.route("/templates/add", methods=['POST'])
@jwt_required()
def add_template():
    user = get_jwt_identity()
    try:
        with connect() as conn:
            with conn.cursor() as curs:
                req = request.get_json()
                name = req.get("name")
                exercises = req.get("exerciseIDs")
                sets = req.get("sets")
                # Frontend must validate that exercises and sets are of same length
                if not name or not exercises or not sets:
                    return jsonify({"error": "missing name, exercises, or sets"}), 409
                curs.execute("INSERT INTO templates(user_id, template_name) VALUES(%s, %s) RETURNING template_id", (user, name))
                template_id = curs.fetchone()[0]
                for i in range(len(exercises)):
                    curs.execute("INSERT INTO template_exercises(template_id, ex, default_num_sets) VALUES(%s, %s, %s)", (template_id, exercises[i], sets[i]))
                conn.commit()
                return jsonify({"message": "added"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "something is wrong"}), 500


# Fethces complete list of exercises along with their types and muscle groups
@app.route("/exerciseList/fetch", methods=['GET'])
# @jwt_required() do we really need auth for this one?
def get_exercises():
    try:
        with connect() as conn:
            with conn.cursor() as curs:
                curs.execute("SELECT ex_name, ex_type, ex_muscle, ex_id FROM exercise_list")
                exercises = curs.fetchall()
                ex_list = []
                if not exercises:
                    return jsonify({"error": "no exercises"}), 404
                for ex in exercises:
                    ex_list.append({"name": ex[0], "type": ex[1], "muscle": ex[2], "id": ex[3]})
                return jsonify({"exercises": ex_list}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "something is wrong"}), 500


@app.route("/sessions/start", methods=['POST'])
@jwt_required()
def start_session():
    user = get_jwt_identity()
    try: 
        with connect() as conn:
            with conn.cursor() as curs:
                req = request.get_json()
                # template ID should be passed in with request
                template_id = req.get("templateID")
                if not template_id:
                    return jsonify({"error": "missing template ID"}), 401
                curs.execute("INSERT INTO sessions(user_id, day_in_split, start_time) VALUES(%s, %s, NOW()) RETURNING session_id", (user, template_id))
                session_id = curs.fetchone()[0]
                if not session_id:
                    return jsonify({"error": "something is wrong, probably an invalid template ID"}), 401
                conn.commit()
                return jsonify({"message": "started", "sessionID": session_id}), 201
    except Exception as e:
        return jsonify({"error": "something is wrong", "str": e}), 500
    
@app.route("/sessions/end", methods=['POST'])
@jwt_required()
def end_session():
    try:
        with connect() as conn:
            with conn.cursor() as curs:
                req = request.get_json()
                session_id = req.get("sessionID")
                if not session_id:
                    return jsonify({"error": "missing session ID"}), 409
                curs.execute("UPDATE sessions SET end_time = NOW() WHERE session_id = %s", (session_id,))
                conn.commit()
                return jsonify({"message": "ended"}), 200
    except:
        return jsonify({"error": "something is wrong"}), 500

@app.route("/templates/delete", methods=['DELETE'])
@jwt_required()
def delete_template():
    user = get_jwt_identity()
    return jsonify({"message": "deleted"}), 200


# TODO: ADD SERVER SIDE FILTERING
@app.route("/sets/fetch", methods=['GET'])
@jwt_required()
def get_sets():
    user = get_jwt_identity()
    try:
        with connect() as conn:
            with conn.cursor() as curs:
                curs.execute(
                    """
                    SELECT s.start_time, e.ex_name, ARRAY_AGG(se.weight) AS weights, ARRAY_AGG(se.reps) AS reps
                    FROM sets se
                    JOIN sessions s ON se.session_id = s.session_id
                    JOIN exercise_list e ON se.ex_id = e.ex_id
                    WHERE s.user_id = %s
                    GROUP BY s.start_time, e.ex_name
                    """,
                    (user,)
                )
                results = curs.fetchall()

                sessions = {}
                for start_time, ex_name, weights, reps in results:
                    start_time_str = start_time.strftime("%Y-%m-%d %H:%M:%S")
                    if start_time_str not in sessions:
                        sessions[start_time_str] = {
                            "exercises": [],
                            "weights": [],
                            "reps": []
                        }

                    sessions[start_time_str]["exercises"].append(ex_name)
                    sessions[start_time_str]["weights"].append(weights)
                    sessions[start_time_str]["reps"].append(reps)

                return jsonify(sessions), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "something is wrong"}), 500
    

# Add set given session ID, exercise ID, Weight, Reps
@app.route("/sets/add", methods=['POST'])
@jwt_required()
def add_set():
    user = get_jwt_identity()
    try:
        with connect() as conn:
            with conn.cursor() as curs:
                req = request.get_json()
                session_id = req.get("sessionID")
                weight = req.get("weight")
                reps = req.get("reps")
                exercise_id = req.get("exerciseID")
                if not session_id or not weight or not reps or not exercise_id:
                    return jsonify({"error": "missing session ID, weight, reps, or exercise ID"}), 401
                curs.execute("INSERT INTO sets(session_id, ex_id, weight, reps, user_id) VALUES(%s, %s, %s, %s, %s)", (session_id, exercise_id, weight, reps, user))
                conn.commit()
                return jsonify({"message": "added"}), 201
    except:
        return jsonify({"error": "something is wrong"}), 500

@app.route("/analyze", methods=['GET'])
@jwt_required()
def analyze():
    user = get_jwt_identity()
    return analyze_routine_with_ai(user)

@app.route("/workouts/delete", methods=['DELETE'])
@jwt_required()
def delete_workout():
    user = get_jwt_identity()
    return jsonify({"message": "deleted"}), 200

if(__name__ == "__main__"):
    app.run()
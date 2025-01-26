from db_interactions import connect
import boto3
import json
import psycopg
from dotenv import load_dotenv
import os
from botocore.config import Config

def extract_from_database(user_id):
    try:
        user_id = int(user_id)
        with connect() as conn:
            with conn.cursor() as curs:
                print("Connected to database")
                curs.execute("SELECT template_id FROM templates WHERE user_id = %s", (user_id,))
                template_data = curs.fetchall()
                print("Fetched data")
                if not template_data:
                    return {"error": "no templates"}
                for i in range(len(template_data)):
                    curs.execute("SELECT ex, default_num_sets FROM template_exercises WHERE template_id = %s", (template_data[i][0],))
                    ex_data = curs.fetchall()
                    print("Fetched exercises")
                    exercises = []
                    sets = []
                    for ex in ex_data:
                        curs.execute("SELECT ex_name FROM exercise_list WHERE ex_id = %s", (ex[0],))
                        name = curs.fetchone()
                        print("Fetched exercise name")
                        exercises.append(name)
                        sets.append(ex[1])
                    template_data[i] = template_data[i] + (exercises, sets)
                    print("Appended exercises")
                return template_data
    except Exception as e:
        return {"error": str(e)}

def analyze_routine_with_ai(user_id):
    try: 
        data = extract_from_database(user_id)
        print("ectracted")
        load_dotenv()
        boto3.setup_default_session(
            region_name='us-west-2',
            aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY"),
            aws_session_token = os.getenv("AWS_SESSION_TOKEN")
        )
        print("AWS login")
        prompt = "I need a new well rounded workout routine for myself.MAKE SURE TO INCLUDE EXERCISES FOR EVERY SINGLE MUSCLE. My current routine consists of the following exercises:\n "
        numDay = 1
        for i in range(len(data[0][1])):
            print(data[0][1][i])
            prompt += f"Day {numDay}:"
            prompt += str(data[0][1][i]) + " for " + str(data[0][2][i]) + " sets\n"
            numDay += 1
        prompt += '''Summarize (very briefly) what muscle groups I am currently hitting with what intensity, and suggest what workouts I should add here to target all my muscles effectively. Respond with a list of exercises and the number of sets for each exercise. 
            Make sure that your response is in this format(YOUR RESPONSE SHOULD ONLY RETURN IN THE FORMAT I AM GIVING): \n
            Hi there! Seems like your workout is targeting <muscle groups> with <intensity>. You should add the following exercises to target all your muscles more effectively: \n
            <List of suggested exercises> \n
            This will help you target all your muscles more effectively. Don't be shy to get a custom routine for yourself!\n'''
        if "error" in data:
            return data
        client = boto3.client(
            "bedrock-runtime"
        )
        model_id = 'mistral.mistral-7b-instruct-v0:2'
        json_to_mistral = json.dumps({
            "prompt": f"<s>[INST]{prompt}[/INST]",
            "max_tokens": 5000,
            "temperature": 0.4,
            "top_p": 0.9,
            "top_k": 50,
        })

        #print('Sending to Mistral')
        response = client.invoke_model(
                    modelId=model_id,  # Replace with the actual Mistral model ID in Bedrock
                    body=json_to_mistral,
                    contentType="application/json"  # Replace with JSON if necessary
                )
        print("AWS responded")
        resp = response["body"].read().decode("utf-8")
        trimmed = resp[resp.index("\"text\"") + 7:resp.index("\"stop_reason\"") - 1]
        print('Trimmed')
        valid_json = bytes(trimmed, "utf-8").decode("unicode_escape").strip('"')
        print('made Valid json')
        return valid_json
    except Exception as e: 
        print(e)

def speak_with_polly(user_id, text):
    try:
        load_dotenv()
        client = boto3.client(
            "polly",
            region_name="us-west-2",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            aws_session_token=os.getenv("AWS_SESSION_TOKEN")
        )
        response = client.synthesize_speech(
            Text=text,
            OutputFormat="mp3",
            VoiceId="Matthew"
        )
        with open("../../assets/Analysis.mp3", "wb") as f:
            f.write(response["AudioStream"].read())
    except Exception as e:
        print(e)

def personalized_routine(user_id):
    load_dotenv()
    client = boto3.client(
        "bedrock-runtime"
    )
    model_id = 'mistral.mistral-7b-instruct-v0:2'
    with open("personalize_workout.txt", "r") as f:
        prompt = f.read()
        with connect() as conn:
            with conn.cursor() as curs:
                curs.execute("SELECT preference, type, height_in, weight_lb FROM users WHERE user_id = %s", (user_id,))
                user_data = curs.fetchone()
                print("Fetched user data")
                prompt += f"I wish to do mostly{user_data[0]} workouts. I am a {user_data[1]} who is {user_data[2]} inches tall and weighs {user_data[3]} pounds."
        json_to_mistral = json.dumps({
        "prompt": f"<s>[INST]{prompt}[/INST]",
        "max_tokens": 5000,
        "temperature": 0.4,
        "top_p": 0.9,
        "top_k": 50,
    })
        #print('Sending to Mistral')
        response = client.invoke_model(
                    modelId=model_id,  # Replace with the actual Mistral model ID in Bedrock
                    body=json_to_mistral,
                    contentType="application/json"  # Replace with JSON if necessary
                )
        resp = response["body"].read().decode("utf-8")
        trimmed = resp[resp.index("\"text\"") + 7:resp.index("\"stop_reason\"") - 1]
        print('Trimmed')
        valid_json = bytes(trimmed, "utf-8").decode("unicode_escape").strip('"')
        print('made Valid json')
        return valid_json

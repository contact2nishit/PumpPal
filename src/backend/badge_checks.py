from datetime import datetime, timedelta

def check_consistency_metrics(cursor, user_id):
    badges = ["Humble Beginner", "Consistent King", "I Love Gym", "Gym is Life"]
    days = [(20, 30), (60, 90), (120, 180), (240, 360)]
    current_date = datetime.now()
    for i in range(len(days) - 1, -1, -1):
        badge_name = badges[i]
        cursor.execute("SELECT 1 FROM badges WHERE user_id = %s AND badge_name = %s", (user_id, badge_name))
        if cursor.fetchone():
            continue
        m, n = days[i]
        start_date = current_date - timedelta(days=n)
        cursor.execute(
            """
            SELECT COUNT(*) 
            FROM sessions 
            WHERE user_id = %s AND start_time >= %s AND start_time <= %s
            """,
            (user_id, start_date, current_date)
        )
        count = cursor.fetchone()[0]
        if count >= m:
            cursor.execute(
                """
                INSERT INTO badges (user_id, badge_name)
                VALUES (%s, %s)
                """,
                (user_id, badge_name)
            )
            return badge_name
    return None

def check_first_timer(cursor, user_id):
    badge_name = "First Timer"
    cursor.execute("SELECT 1 FROM badges WHERE user_id = %s AND badge_name = %s", (user_id, badge_name))
    if cursor.fetchone():
        return None
    else:
        cursor.execute("INSERT INTO badges (user_id, badge_name) VALUES (%s, %s)", (user_id, badge_name))
        return badge_name

def check_early_bird(cursor, user_id):
    badge_name = "Early Bird"
    cursor.execute("SELECT 1 FROM badges WHERE user_id = %s AND badge_name = %s", (user_id, badge_name))
    if cursor.fetchone():
        return None
    cursor.execute("SELECT COUNT(*) FROM sessions WHERE user_id = %s AND EXTRACT(HOUR FROM start_time) < 8", (user_id,))
    early_sessions_count = cursor.fetchone()[0]
    if early_sessions_count >= 5:
        cursor.execute("INSERT INTO badges (user_id, badge_name) VALUES (%s, %s)", (user_id, badge_name))
        return badge_name
    return None
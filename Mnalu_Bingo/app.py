from flask import Flask, render_template, request, jsonify
import sqlite3
import random

app = Flask(__name__)

numbers = list(range(1,76))

def get_db():
    conn = sqlite3.connect("bingo.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():

    conn = get_db()

    conn.execute("""
    CREATE TABLE IF NOT EXISTS players(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cartela INTEGER,
    amount INTEGER
    )
    """)

    conn.commit()
    conn.close()

init_db()

def get_letter(n):

    if n<=15: return "B"
    if n<=30: return "I"
    if n<=45: return "N"
    if n<=60: return "G"
    return "O"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/admin")
def admin():

    conn = get_db()

    players = conn.execute(
        "SELECT * FROM players ORDER BY cartela"
    ).fetchall()

    conn.close()

    return render_template("admin.html", players=players)


@app.route("/add_player", methods=["POST"])
def add_player():

    name = request.form["name"]
    cartela = request.form["cartela"]
    amount = request.form["amount"]

    conn = get_db()

    conn.execute(
        "INSERT INTO players(name,cartela,amount) VALUES(?,?,?)",
        (name,cartela,amount)
    )

    conn.commit()
    conn.close()

    return jsonify({"status":"ok"})


@app.route("/draw")
def draw():

    global numbers

    if len(numbers)==0:
        return jsonify({"number":"Game Finished"})

    num = random.choice(numbers)
    numbers.remove(num)

    letter = get_letter(num)

    return jsonify({
        "number": letter+str(num),
        "value": num
    })


@app.route("/reset")
def reset():

    global numbers
    numbers = list(range(1,76))

    conn = get_db()
    conn.execute("DELETE FROM players")
    conn.commit()
    conn.close()

    return jsonify({"status":"reset"})


if __name__ == "__main__":
    app.run(debug=True)
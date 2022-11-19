import os

from flask import Flask, render_template


template_folder = os.path.abspath("./html")

app = Flask(__name__, template_folder=template_folder)
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/", methods=["GET"])
def home():
    return render_template("tictactoe.html")


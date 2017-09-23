from flask import Flask, render_template, redirect, request, url_for
import config

app = Flask(__name__)


@app.route('/')
def index():
    column_number_list = config.COLUMN_NUMBER_LIST
    row_number_list = config.ROW_NUMBER_LIST

    return render_template('index.html',
                           column_number_list=column_number_list,
                           row_number_list=row_number_list)


@app.route('/game', methods=['POST'])
def game():
    return render_template('game.html')
    

if __name__ == "__main__":
    app.run(debug=True)
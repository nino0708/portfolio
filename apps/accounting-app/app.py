"""Kaikei 会計管理の起動口。アプリ本体の組み立てと画面(/, /manual)だけを持つ。
   APIは routes/、DB・計算の共通部分は common.py。"""
import threading
import webbrowser

from flask import Flask, render_template

from common import resource_path, init_db, DATABASE
from routes import accounts, data, entries, periods, reports

app = Flask(__name__,
            template_folder=resource_path('templates'),
            static_folder=resource_path('static'))
for _bp in (periods.bp, accounts.bp, entries.bp, reports.bp, data.bp):
    app.register_blueprint(_bp)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/manual')
def manual():
    return render_template('manual.html')


def main():
    init_db()
    url = 'http://localhost:5050'
    print(f'Kaikei 会計管理 を起動しました → {url}')
    print('終了するにはこのウィンドウを閉じてください。')
    print(f'データの保存先: {DATABASE}')
    # use_reloader=False: exe化したときに自分自身を再起動して多重起動するのを防ぐ
    threading.Timer(1.2, lambda: webbrowser.open(url)).start()
    app.run(debug=False, port=5050, use_reloader=False)


if __name__ == '__main__':
    main()

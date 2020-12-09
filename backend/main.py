from flask import Flask, jsonify
from source import getDados
from source import recomendacao
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return jsonify(["Seja bem vindo a API de Recomendação de Filmes."])

@app.route("/user/<string:id>", methods=["GET"])
def verificaId(id):
  return jsonify(getDados.get_users_id(id))

@app.route("/users/<string:id>", methods=["GET"])
def filmesByUser(id):
  return jsonify(getDados.get_filmes_por_users(id))

@app.route("/recomendacao/<string:id>", methods=["GET"])
def recomendarfilmes(id):
  base = getDados.jsonUsers()
  return jsonify(recomendacao.recomendar(base, id))

if __name__ == '__main__':
    app.run(host='127.0.0.1', port='5000', debug=True)
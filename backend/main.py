# !/usr/bin/env python3
# -*- coding: utf-8 -*-

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

@app.route("/usuario/<string:id>", methods=["GET"])
def verificaId(id):
  return jsonify(getDados.get_users_id(id))

@app.route("/filmes_usuario/<string:id>", methods=["GET"])
def filmesByUser(id):
  dado = getDados.get_filmes_por_users(id)
  retorno_alterado_filmes_assistidos = []
  for x, notas_filmes in dado.items():
    retorno = getDados.get_filme_id(x)
    retorno.update({"nota": notas_filmes})
    retorno.update({'movieId': x})
    retorno_alterado_filmes_assistidos.append(retorno)
  return jsonify(retorno_alterado_filmes_assistidos[:26])

@app.route("/recomendacao/<string:id>", methods=["GET"])
def recomendarfilmes(id):
  base = getDados.jsonUsers()
  dado = recomendacao.recomendar(base, id)
  retorno_alterado_filmes = []
  for x in dado:
    retorno = getDados.get_filme_id(x[1])
    retorno.update({'movieId': x[1]})
    retorno_alterado_filmes.append(retorno)
  return jsonify(retorno_alterado_filmes)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)
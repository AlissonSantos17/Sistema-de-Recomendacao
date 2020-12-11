# !/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os

# DEFININDO A PASTA ATUAL
currently_path = os.path.abspath(os.path.dirname(__file__))
# DEFININDO O DIRETÓRIO DO DATASET USERS
users_path = os.path.join(currently_path, "../users.json")
# DEFININDO O DIRETÓRIO DO DATASET MOVIES
movies_path = os.path.join(currently_path, "../movies.json")

# FAZ A LOAD DE TODOS OS DADOS CONTIDOS NO USERS.JSON
def jsonUsers():
  with open(users_path) as jsonFileUsers:
    return json.load(jsonFileUsers)

# RETORNA TODOS OS DADOS DENTRO DO JSON
def get_users():
  return jsonUsers()

#FAZ A VERIFICAÇÃO SE O ID PASSADO CONTEM NO USER.JSON
def get_users_id(id):
  users = jsonUsers()
  if id in users.keys():
    return True
  return False

# RETORNA TODOS OS FILMES ASSISTIDOS PELO userID
def get_filmes_por_users(userId):
  users = jsonUsers()
  return users[userId]

# FAZ A LOAD DE TODOS OS DADOS CONTIDOS NO USERS.JSON
def jsonMovies():
  with open(movies_path) as jsonFileMovies:
    return json.load(jsonFileMovies)

# RETORNA O FILME PELO userID
def get_filme_id(filmeId):
  movies = jsonMovies()
  return movies[filmeId]
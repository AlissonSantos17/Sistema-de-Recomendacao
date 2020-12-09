# !/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# FAZ A LOAD DE TODOS OS DADOS CONTIDOS NO USERS.JSON
def jsonUsers():
  with open('backend/users.json') as jsonFileUsers:
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
  with open('backend/movies.json') as jsonFileMovies:
    return json.load(jsonFileMovies)

# RETORNA O FILME PELO userID
def get_filme_id(filmeId):
  movies = jsonMovies()
  return movies[filmeId]


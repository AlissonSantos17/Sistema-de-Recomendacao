# !/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from getDados import criarPoster

# FAZ A LOAD DE TODOS OS DADOS CONTIDOS NO USERS.JSON
def jsonUsers():
  with open('./users.json') as jsonFileUsers:
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
  with open('./movies.json') as jsonFileMovies:
    return json.load(jsonFileMovies)

# RETORNA O FILME PELO userID
def get_filme_id(filmeId):
  movies = jsonMovies()
  return movies[filmeId]

def get_poster_filme_id(tmdbId):
  poster = criarPoster()
  return poster[tmdbId] if tmdbId in poster.keys() else None

def update_poster(tmdbId, path):
  poster = criarPoster()
  poster.update({tmdbId: path})
  with open('posterFilmes', 'w') as outFile:
    jsom.dump(poster, outFile)
update_poster()
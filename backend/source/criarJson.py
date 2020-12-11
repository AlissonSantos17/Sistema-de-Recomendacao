# !/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv, json

csv_ratings = 'backend/data/ratings.csv'
csv_movies = 'backend/data/movies.csv'
csv_links = 'backend/data/links.csv'

filmes = {}

# GERA O JSON USERS
def criarUsers():
  users = {}
  with open(csv_ratings) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
      fazInsercao = True
      for x in users.keys():
        if (x != None):
          if x == rows['userId']:
            fazInsercao = False
      if (fazInsercao):
        users.update({rows['userId']: {}})

  with open(csv_ratings) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
      for x in users.keys():
        if x == rows['userId']:
          users[x].update({rows['movieId']: float(rows['rating'])})

  with open('users.json', 'w') as outFile:
    json.dump(users, outFile)

# GERA O JSON MOVIES
def criarMovies():
  movies = {}
  with open(csv_movies, newline='', encoding="utf8") as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
      filmes = {rows['movieId']: {"title": rows['title'], "genres": rows['genres']}}
      movies.update(filmes)

  with open(csv_links, newline='', encoding="utf8") as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
      filmes = {"imdbId": rows['imdbId'], "tmdbId": rows['tmdbId']}
      movies[rows['movieId']].update(filmes)

  with open('movies.json', 'w') as outFile:
    json.dump(movies, outFile)

# EXECUTA AS FUNÇÕES
if __name__ == "__main__":
  criarUsers()
  criarMovies()
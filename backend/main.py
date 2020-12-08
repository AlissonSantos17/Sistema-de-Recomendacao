#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
idx = pd.IndexSlice

movies = pd.read_csv("backend/datasets/movies.csv", index_col=['movieId'])
ratings = pd.read_csv("backend/datasets/ratings.csv")
links = pd.read_csv("backend/datasets/links.csv").set_index("movieId").drop('tmdbId', axis=1)

def gerarGrafo(movies, ratings):
  grafo = {}
  pass
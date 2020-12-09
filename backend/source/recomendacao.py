# !/usr/bin/env python3
# -*- coding: utf-8 -*-
from euclidiana import distanciaEuclidiana
from getDados import jsonUsers

def recomendacao(base, usuario):
  totais = {}
  soma_similaridade = {}
  for outro in base:
    if outro == usuario:
      continue
    similaridade = distanciaEuclidiana(base ,usuario, outro)
    if similaridade <= 0:
      continue
    for item in base[outro]:
      if item not in base[usuario]:
        totais.setdefault(item, 0)
        totais[item] += base[outro][item] * similaridade
        soma_similaridade.setdefault(item, 0)
        soma_similaridade[item] += similaridade
  rankings = [(total / soma_similaridade[item], item) for item, total in totais.items()]
  rankings.sort()
  rankings.reverse()
  return rankings[0:15]

base = jsonUsers()
print(recomendacao(base, '1'))
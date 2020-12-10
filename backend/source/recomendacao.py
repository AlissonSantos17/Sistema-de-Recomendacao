# !/usr/bin/env python3
# -*- coding: utf-8 -*-

from math import sqrt

def distanciaEuclidiana(base, usuario1, usuario2):
  si = {}
  for item in base[usuario1]:
    if item in base[usuario2]:
      si[item] = 1
  if len(si) == 0:
    return 0
  soma = sum([pow(base[usuario1][item] - base[usuario2][item], 2)
          for item in base[usuario1] if item in base[usuario2]])
  return 1 / (1 + sqrt(soma))


def recomendar(base, usuario):
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
  return rankings[0:16]
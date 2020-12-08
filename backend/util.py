# !/usr/bin/env python3
# -*- coding: utf-8 -*-

from math import sqrt

def carregarDados(path='backend/datasets'):
  filmes = {}
  for linha in open(path + '/u.item'):
    (id, titulo) = linha.split('|')[0:2]
    filmes[id] = titulo

  base = {}
  for linha in open(path + '/u.data'):
    (usuario, idFilme, nota, tempo) = linha.split('\t')
    base.setdefault(usuario, {})
    base[usuario][filmes[idFilme]] = float(nota)
  return base

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


def getSimilares(base, usuario):
  similaridade = [
    (distanciaEuclidiana(base, usuario, outro), outro)
    for outro in base if outro != usuario
  ]
  similaridade.sort()
  similaridade.reverse()
  return similaridade[0:15]


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

base = carregarDados()
print(base)
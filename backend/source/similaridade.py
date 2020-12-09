# !/usr/bin/env python3
# -*- coding: utf-8 -*-
from euclidiana import distanciaEuclidiana

def getSimilares(base, usuario):
  similaridade = [
    (distanciaEuclidiana(base, usuario, outro), outro)
    for outro in base if outro != usuario
  ]
  similaridade.sort()
  similaridade.reverse()
  return similaridade[0:15]
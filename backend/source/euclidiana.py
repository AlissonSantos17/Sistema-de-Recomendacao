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

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
// import { trackPromise } from 'react-promise-tracker';

export default function Recomendacao() {
  const [filmes, setFilmes] = useState([]);
  const [recomendarFilmes, setRecomendarFilmes] = useState([]);

  useEffect(() => {
    async function recomendation() {
      const userId = localStorage.getItem('id');
      const filmeUsers = await api.get(`/filmes_usuario/${userId}`);
      const filmeUsersRecomendation = await api.get(`/recomendacao/${userId}`);
      console.log(filmeUsersRecomendation.data)
      setFilmes(filmeUsers.data)
      setRecomendarFilmes(filmeUsersRecomendation.data)
    }
    recomendation()
  }, [])

 return(
 <>
    <div className="container">
      <strong>Filmes assistidos pelo usuario </strong>
    </div>
    <ul className="filmes-assistidos-usuario">
      {filmes.map(filme => (
        <li key={filmes.movieId}>
          <strong>Titulo: {filme.title}</strong>
          <span className="avaliacao"> Nota do filme: {filme.nota}</span>
          <span>Gênero: {filme.genres}</span>
        </li>
      ))}
    </ul>
    <div className="container">
      <strong>Filmes que recomendamos para assistir</strong>
    </div>
    <ul className="filmes-recomendados-usuario">
      {recomendarFilmes.map(recomenda => (
        <li key={recomenda.movieId}>
          <strong>Titulo: {recomenda.title}</strong>
          <span>Gênero: {recomenda.genres}</span>
        </li>
      ))}
    </ul>
 </>
 );
};
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
      <strong>Filmes que ele assistiu</strong>
    </div>
    <ul className="filmes-usuario">
      {filmes.map(filme => (
        <li key={filmes.movieId}>
          <strong>{filme.title}</strong>
          <span className="avaliacao"> Avaliação: {filme.avaliacao}</span>
          <span>{filme.genres}</span>
        </li>
      ))}
    </ul>
 </>
 );
};
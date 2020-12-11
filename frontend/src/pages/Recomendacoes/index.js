import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './styles.css';

export default function Recomendacao() {
  const [filmes, setFilmes] = useState([]);
  const [recomendarFilmes, setRecomendarFilmes] = useState([]);

  useEffect(() => {
    async function recomendation() {
      const userId = localStorage.getItem('id');
      const filmeUsers = await api.get(`/filmes_usuario/${userId}`);
      const filmeUsersRecomendation = await api.get(`/recomendacao/${userId}`);
      setFilmes(filmeUsers.data)
      setRecomendarFilmes(filmeUsersRecomendation.data)
    }
    recomendation()
  }, [])

 return(
 <>
  <div className="container">
    <div className="filmes-geral">
      <div className="titulo">
        <strong>Filmes que você assistiu:</strong>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID do Filme</th>
            <th>Filme</th>
            <th>Nota do filme</th>
            <th>Gênero</th>
          </tr>
        </thead>
        <tbody>
          {filmes.map(filme => (
            <tr key={filmes.movieId}>
              <td>{filme.movieId}</td>
              <td>{filme.title}</td>
              <td>{filme.nota.toFixed(1)}</td>
              <td>{filme.genres}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="filmes-geral">
      <div className="titulo">
        <strong>Filmes recomendado para você:</strong>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID do Filme</th>
            <th>Filme</th>
            <th>Gênero</th>
          </tr>
        </thead>
        <tbody>
          {recomendarFilmes.map((recomendar, i) => (
            <tr key={recomendarFilmes.movieId}>
              <td>{recomendar.movieId}</td>
              <td>{recomendar.title}</td>
              <td>{recomendar.genres}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
 </>
 );
};
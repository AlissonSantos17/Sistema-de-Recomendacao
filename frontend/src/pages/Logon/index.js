import React, { useState } from 'react';
import filmeImg from '../../assets/filme.png'
import api from '../../services/api';

import './styles.css';

export default function Logon({ history }) {
  const [id, setId] = useState([]);
  
  function refreshPage(){ 
    window.location.reload(); 
  }
  async function handleLogin(e)  {
    e.preventDefault();
    const response = await api.get(`/usuario/${id}`);
    console.log(`Usuario encontrado na base de dados: ${response.data}`)
    localStorage.setItem('id', id);

    if(response.data === true) {
      history.push('/recomendacao');
    } else {
      alert('Informe um numero entre 1 - 610');
      refreshPage()
    }
  } 
  return (
    <div className="logon-container">
      <section className="form">
        <form onSubmit={handleLogin}>
          <img src={filmeImg} width={200} alt="logotipo"/>
          <h1>Sistema de Recomendação</h1>
          <h1>Usúario 1 - 610:</h1>
          <input 
            placeholder="Seu usúario"
            value={id}
            onChange={e => setId(e.target.value)}
          />
          
          <button className="button">Enviar</button>
        </form>
      </section>
    </div>
  );
}
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'reactstrap';

import api from '../../services/api';

import './styles.css';

export default function Logon() {
  const [id, setId] = useState([]);
  const history = useHistory()
  
  function refreshPage(){ 
    window.location.reload(); 
  }
  async function handleLogin(e)  {
    e.preventDefault();
    const response = await api.get('/user/' + id);
    console.log(`Usuario encontrado na base de dados: ${response.data}`)
    localStorage.setItem('id', id);

    if(id > 0 & id <= 610) {
      history.push('/recomendacoes');
    } else {
      alert('Informe um numero entre 1 - 610');
      refreshPage()
    }
  } 
  return (
    <div className="logon-container">
      <section className="form">
        <form onSubmit={handleLogin}>
          <h1>Digite um ID de 1 a 610:</h1>
          <input 
            placeholder="Sua ID"
            value={id}
            onChange={e => setId(e.target.value)}
          />
          <button className="button">Enviar</button>
        </form>
      </section>
    </div>
  );
}
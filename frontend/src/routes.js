import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Logon from './pages/Logon';
import Recomendacao from './pages/Recomendacoes';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/recomendacao" component={Recomendacao} />
      </Switch>
    </BrowserRouter>
  );
}
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import CadastrarUsuario from './pages/cadastrar-usuario';
import ListarHerois from './pages/listar-herois';
import CadastrarHeroi from './pages/cadastrar-heroi';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/login" component={Login} />
                <Route path="/cadastrar" component={CadastrarUsuario} />
                <Route path="/herois/listar" component={ListarHerois} />
                <Route path="/herois/cadastrar" component={CadastrarHeroi} />
            </Switch>
        </BrowserRouter>
    );
}

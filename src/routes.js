import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import CadastrarUsuario from './pages/cadastrar-usuario';
import ListarHerois from './pages/listar-herois';
import CadastrarHeroi from './pages/cadastrar-heroi';

export default function MyRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Login/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/cadastrar" element={<CadastrarUsuario/>} />
                <Route path="/herois/listar" element={<ListarHerois/>} />
                <Route path="/herois/cadastrar" element={<CadastrarHeroi/>} />
            </Routes>
        </BrowserRouter>
    );
}

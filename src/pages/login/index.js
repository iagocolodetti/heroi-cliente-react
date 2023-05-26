import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './styles.css';

import api from '../../services/api';

import DivAlert from '../../components/DivAlert';

function Login() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [authorization, setAuthorization] = useState('');
    const [logandoUsuario, setLogandoUsuario] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    function divAlert(message, alert) {
        return (<DivAlert message={message} alert={alert} />);
    }

    useEffect(() => {
        if (localStorage.getItem('heroisApiAuth')) {
            navigate('/herois/listar');
        } else {
            const error = localStorage.getItem('heroisApiAuthError');
            if (error) {
                setMensagem(divAlert(`Erro: ${error}.`, 'alert-danger'));
                localStorage.removeItem('heroisApiAuthError');
            }
        }
    }, [authorization, navigate]);

    async function login() {
        setMensagem(null);
        if (!nome) {
            setMensagem(divAlert('Erro: Preencha o campo destinado ao nome.', 'alert-danger'));
        } else if (!senha) {
            setMensagem(divAlert('Erro: Preencha o campo destinado à senha.', 'alert-danger'));
        } else {
            setLogandoUsuario(true);
            try {
                const response = await api.post('/usuarios/login', { nome, senha });
                const { authorization } = response.headers;
                localStorage.setItem('heroisApiAuth', authorization);
                setAuthorization(authorization);
            } catch (error) {
                setMensagem(divAlert(error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível fazer login.', 'alert-danger'));
            } finally {
                setLogandoUsuario(false);
            }
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand py-0">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/cadastrar">Cadastrar</Link>
                    </li>
                </ul>
            </nav>
            <h3>Logar Usuário</h3>
            <div className="form-row mb-4 justify-content-center">
                <div className="col-xs-12 col-sm-11 col-md-4 col-lg-4 input-wrap">
                    <input type="text" className="form-control" id="nome" name="nome" value={nome} onChange={e => setNome(e.target.value)} required/>
                    <span className="floating-label">Nome</span>
                </div>
            </div>
            <div className="form-row mb-4 justify-content-center">
                <div className="col-xs-12 col-sm-11 col-md-4 col-lg-4 input-wrap">
                    <input type="password" className="form-control" id="senha" name="senha" value={senha} onChange={e => setSenha(e.target.value)} required/>
                    <span className="floating-label">Senha</span>
                </div>
            </div>
            {mensagem}
            <div className="form-row mb-4 justify-content-center">
                <button className="btn btn-success btn-fix" onClick={login} disabled={logandoUsuario}>Logar</button>
            </div>
        </>
    );
}

export default Login;

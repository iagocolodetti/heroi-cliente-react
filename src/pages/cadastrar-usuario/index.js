import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './styles.css';

import api from '../../services/api';

import DivAlert from '../../components/DivAlert';

function CadastrarUsuario() {
    const history = useHistory();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepetida, setSenhaRepetida] = useState('');
    const [cadastrando, setCadastrando] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    function divAlert(message, alert) {
        return (<DivAlert message={message} alert={alert} />);
    }

    useEffect(() => {
        if (localStorage.getItem('heroisApiAuth')) {
            history.push('/herois/listar');
        }
    }, [history]);

    async function cadastrar(e) {
        e.preventDefault();
        setMensagem(null);
        if (!nome) {
            setMensagem(divAlert('Erro: Preencha o campo destinado ao nome.', 'alert-danger'));
        } else if (!senha) {
            setMensagem(divAlert('Erro: Preencha o campo destinado à senha.', 'alert-danger'));
        } else if (!senhaRepetida) {
            setMensagem(divAlert('Erro: Repita a senha.', 'alert-danger'));
        } else if (senha !== senhaRepetida) {
            setMensagem(divAlert('Erro: Senhas diferentes.', 'alert-danger'));
        } else {
            setCadastrando(true);
            try {
                await api.post('/usuarios', { nome, senha });
                setNome('');
                setSenha('');
                setSenhaRepetida('');
                setMensagem(divAlert(`Usuário '${nome}' cadastrado com sucesso.`, 'alert-success'));
            } catch (error) {
                setMensagem(divAlert(error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível cadastrar o usuário.', 'alert-danger'));
            } finally {
                setCadastrando(false);
            }
        }
    }
    
    return (
        <>
            <nav className="navbar navbar-expand py-0">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                </ul>
            </nav>
            <h3>Cadastrar Usuário</h3>
            <form onSubmit={cadastrar}>
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
                <div className="form-row mb-4 justify-content-center">
                    <div className="col-xs-12 col-sm-11 col-md-4 col-lg-4 input-wrap">
                        <input type="password" className="form-control" id="repetir-senha" name="repetir-senha" value={senhaRepetida} onChange={e => setSenhaRepetida(e.target.value)} required/>
                        <span className="floating-label">Repetir Senha</span>
                    </div>
                </div>
                {mensagem}
                <div className="form-row mb-4 justify-content-center">
                    <button type="submit" className="btn btn-success btn-fix" disabled={cadastrando || !nome || !senha || !senhaRepetida || senha !== senhaRepetida}>Cadastrar</button>
                </div>
            </form>
        </>
    );
}

export default CadastrarUsuario;

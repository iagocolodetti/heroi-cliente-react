import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';

import './styles.css';

import Logout from '../../components/Logout';

import api from '../../services/api';

import DivAlert from '../../components/DivAlert';

function ListarHerois() {
    const history = useHistory();
    const [authorization] = useState(localStorage.getItem('heroisApiAuth'));
    const [herois, setHerois] = useState([]);
    const [mensagem, setMensagem] = useState(null);

    function divAlert(message, alert) {
        return (<DivAlert message={message} alert={alert} />);
    }
    
    const carregarHerois = useCallback(async () => {
        setMensagem(null);
        if (authorization) {
            try {
                const response = await api.get('/herois', { headers: { 'Authorization': authorization } });
                if (response.data.length > 0) {
                    setHerois(response.data);
                } else {
                    setMensagem(divAlert('Não há heróis cadastrados.', 'alert-danger'));
                }
            } catch (error) {
                if (error.response.data.status === "401") {
                    localStorage.removeItem('heroisApiAuth');
                    localStorage.setItem('heroisApiAuthError', error.response.data.message);
                    history.push('/login');
                } else {
                    setMensagem(divAlert(error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível buscar os heróis.', 'alert-danger'));
                }
            }
        } else {
            history.push('/login');
        }
    }, [authorization, history]);
    
    useEffect(() => {
        carregarHerois();
    }, [carregarHerois]);

    async function handleExcluir(heroi) {
        setMensagem(null);
        try {
            await api.delete(`/herois/${heroi.id}`, { headers: { 'Authorization': authorization } });
            setHerois(herois.filter(_heroi => _heroi.id !== heroi.id));
            setMensagem(divAlert(`Herói '${heroi.nome}' excluído com sucesso.`, 'alert-success'));
        } catch (error) {
            if (error.response.data.status === '401') {
                localStorage.removeItem('heroisApiAuth');
                localStorage.setItem('heroisApiAuthError', error.response.data.message);
                history.push('/login');
            } else {
                setMensagem(divAlert(error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível excluir o herói.', 'alert-danger'));
            }
        }
    }

    function HeroisTable() {
        if (herois.length > 0) {
            return (
                <div className="table-responsive">
                    <table id="tabelaHeroi" className="table table-bordered table-sm mx-auto w-auto">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Universo</th>
                                <th>Cadastrado</th>
                                <th>Poder(es)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {herois.map(heroi => (
                                <tr key={heroi.id}>
                                    <td>{heroi.nome}</td>
                                    <td>{heroi.universo.nome}</td>
                                    <td><Moment format='DD/MM/YYYY HH:mm:ss'>{heroi.dataCadastro}</Moment></td>
                                    <td><span>{heroi.poderes.map(poder => `${poder.descricao}; `)}</span></td>
                                    <td>
                                        <button className="btn btn-danger" style={{ height: '1.5em' }}>
                                            <span style={{ position: 'relative', bottom: '8px' }} onClick={() => handleExcluir(heroi)}>Excluir</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else return null;
    }

    return (
        <>
            <nav className="navbar navbar-expand py-0">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/herois/cadastrar">Cadastrar</Link>
                    </li>
                    <Logout />
                </ul>
            </nav>
            <h3>Heróis</h3>
            <HeroisTable />
            {mensagem}
            <div className="form-row mb-4 justify-content-center">
                <button className="btn btn-primary btn-fix" onClick={carregarHerois}>Atualizar</button>
            </div>
        </>
    );
}

export default ListarHerois;

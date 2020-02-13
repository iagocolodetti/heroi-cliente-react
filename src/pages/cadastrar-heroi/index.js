import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './styles.css';

import Logout from '../../components/Logout';

import api from '../../services/api';

import DivAlert from '../../components/DivAlert';

function CadastrarHeroi() {
    const history = useHistory();
    const [authorization] = useState(localStorage.getItem('heroisApiAuth'));
    const [nome, setNome] = useState('');
    const [poder, setPoder] = useState('');
    const [poderes, setPoderes] = useState([]);
    const [universo, setUniverso] = useState('');
    const [universos, setUniversos] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [universosMensagem, setUniversosMensagem] = useState(null);
    const [cadastrandoHeroi, setCadastrandoHeroi] = useState(false);
    
    function divAlert(message, alert) {
        return (<DivAlert message={message} alert={alert} />);
    }

    const buscarUniversos = useCallback(async () => {
        setUniversosMensagem(null);
        try {
            const response = await api.get('/universos');
            setUniversos(response.data);
        } catch (error) {
            setUniversosMensagem(divAlert(error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível buscar os universos.', 'alert-danger'));
        }
    }, []);

    useEffect(() => {
        if (!authorization) {
            history.push('/login');
        } else {
            buscarUniversos();
        }
    }, [authorization, history, buscarUniversos]);
    
    async function cadastrarHeroi() {
        setMensagem(null);
        if (!nome) {
            setMensagem(divAlert('Erro: Preencha o campo destinado ao nome.', 'alert-danger'));
        } else if (!universo) {
            setMensagem(divAlert('Erro: Selecione um universo.', 'alert-danger'));
        } else if (poderes.length === 0) {
            setMensagem(divAlert('Erro: Adicione ao menos um poder.', 'alert-danger'));
        } else {
            setCadastrandoHeroi(true);
            try {
                const heroi = { nome, poderes, universo: { id: universo } };
                await api.post('/herois', JSON.stringify(heroi), { headers: { 'Authorization': authorization } });
                setNome('');
                setPoder('');
                setPoderes([]);
                setUniverso('');
                setMensagem(divAlert(`Herói '${heroi.nome}' adicionado com sucesso.`, 'alert-success'));
            } catch (error) {
                if (error.response.data.status === 401) {
                    localStorage.removeItem('heroisApiAuth');
                    localStorage.setItem('heroisApiAuthError', error.response.data.message);
                    history.push('/login');
                } else {
                    setMensagem(divAlert(error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível cadastrar o herói.', 'alert-danger'));
                }
            } finally {
                setCadastrandoHeroi(false);
            }
        }
    }

    function adicionarPoder() {
        setPoderes([...poderes, {
            'id': poderes.length === 0 ? 0 : poderes[poderes.length-1].id + 1,
            'descricao': poder
        }]);
        setPoder('');
    }

    function removerPoder(poder) {
        setPoderes(poderes.filter(_poder => _poder.id !== poder.id));
    }

    function UniversosOption() {
        if (!universosMensagem && universos.length > 0) {
            return (
                <div className="form-row mb-4 justify-content-center">
                    <div className="col-xs-12 col-sm-11 col-md-4 col-lg-4 select-wrap">
                        <select className="form-control" id="universo" name="universo" onChange={e => setUniverso(e.target.value)} value={universo} required>
                            <option value="" disabled></option>
                            {universos.map(_universo => 
                                <option key={_universo.id} value={_universo.id}>{_universo.nome}</option>
                            )}
                        </select>
                        <span className="floating-label">Universo</span>
                    </div>
                </div>
            );
        } else if (universosMensagem) {
            return (
                <div>
                    {universosMensagem}
                    <div className="form-row mb-4 justify-content-center">
                        <button className="btn btn-secondary btn-sm" onClick={buscarUniversos}>Buscar Universos</button>
                    </div>
                </div>
            );
        } else return null;
    }

    function PoderesTable() {
        if (poderes.length > 0) {
            return (
                <div className="form-row mb-4 justify-content-center">
                    <div className="table-responsive col-xs-12 col-sm-11 col-md-4 col-lg-4">
                        <table id="tabelaPoderes" className="table table-bordered table-sm mx-auto w-auto">
                            <thead>
                                <tr>
                                    <th>Poder</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poderes.map(_poder => 
                                    <tr key={_poder.id}>
                                        <td width="90%">{_poder.descricao}</td>
                                        <td width="10%">
                                            <button className="btn btn-danger" style={{ height: '1.5em' }}>
                                                <span style={{ position: 'relative', bottom: '8px' }} onClick={() => removerPoder(_poder)}>Remover</span>
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else return null;
    }

    return (
        <>
            <nav className="navbar navbar-expand py-0">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/herois/listar">Listar</Link>
                    </li>
                    <Logout />
                </ul>
            </nav>
            <h3>Cadastrar Herói</h3>
            <div className="form-row mb-4 justify-content-center">
                <div className="col-xs-12 col-sm-11 col-md-4 col-lg-4 input-wrap">
                    <input type="text" className="form-control" id="nome" name="nome" value={nome} onChange={e => setNome(e.target.value)} required/>
                    <span className="floating-label">Nome</span>
                </div>
            </div>
            <UniversosOption />
            <div className="form-row mb-4 justify-content-center">
                <div className="col-xs-12 col-sm-11 col-md-4 col-lg-4 input-group">
                    <input type="text" className="form-control" placeholder="Poder" id="poder" name="poder" value={poder} onChange={e => setPoder(e.target.value)}/>
                    <span className="input-group-btn">
                        <button className="btn btn-primary" onClick={adicionarPoder}>Adicionar</button>
                    </span>
                </div>
            </div>
            <PoderesTable />
            {mensagem}
            <div className="form-row mb-4 justify-content-center">
                <button type="submit" className="btn btn-success btn-fix" onClick={cadastrarHeroi} disabled={!nome || !universo || poderes.length === 0 || cadastrandoHeroi}>Cadastrar</button>
            </div>
        </>
    );
}

export default CadastrarHeroi;

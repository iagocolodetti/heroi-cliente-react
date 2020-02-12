import React from 'react';
import { Link } from 'react-router-dom';

function Logout() {
    function logout() {
        localStorage.clear();
    }

    return (
        <li className="nav-item">
            <Link className="nav-link" to="/login" onClick={logout}>Logout</Link>
        </li>
    );
}

export default Logout;

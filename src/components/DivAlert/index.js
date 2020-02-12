import React from 'react';

function DivAlert(props) {
    const { message, alert } = props;

    return (
        <div className="d-inline-flex p-2 justify-content-center">
            <span className={"alert " + alert} role="alert">
                {message}
            </span>
        </div>
    );
}

export default DivAlert;

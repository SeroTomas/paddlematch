import { Link, useHistory, useLocation } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import { Alert } from 'antd';
import { LoginForm } from './LoginForm';
import { authContext } from '../AuthContext';
import styles from './LoginPage.module.css';

export function LoginPage() {

    const { user } = useContext(authContext);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (user) {
            const { from } = location.state || { from: { pathname: "/" } };
            history.replace(from);
        }
    }, [history, location, user])

    return (
        <>
            <div className={styles.cta}>
                <Alert type="info" message={
                    <span>¿No tienes cuenta?<Link to="/register"> ¡Únete&nbsp;ahora!</Link></span>
                } />
            </div>
            <div className={styles.wrapper}>
                <h1>Iniciar sesion</h1>

                <LoginForm />
            </div>
        </>
    );
}
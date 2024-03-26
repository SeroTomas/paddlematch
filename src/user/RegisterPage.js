import { Link, useHistory } from 'react-router-dom';
import React, { useCallback, useContext } from 'react';

import { RegisterForm } from './RegisterForm';
import { authContext } from '../AuthContext';
import { postRegisterApi } from '../api';
import styles from './RegisterPage.module.css';
import { useApi } from '../useApi';

export function RegisterPage() {

    const { setUser } = useContext(authContext);
    const [state, register] = useApi(postRegisterApi, setUser);
    const history = useHistory();

    const handleFinishUser = useCallback(({ name, mail, password }) => {
        register(null, {
            name,
            mail,
            password,
        }, () => { 
            history.push('/verify-mail/send');
        });
    }, [register, history]);

    return (
        <div className={styles.wrapper}>

            <h1>
                Registrarse
                <div className={styles.loginItem}>
                    <span>¿Ya estás registrado? </span>
                    <Link to="/login">Iniciar sesion</Link>
                </div>
            </h1>

            <RegisterForm
                apiState={state}
                onFinish={handleFinishUser}
            />
        </div>
    );
}
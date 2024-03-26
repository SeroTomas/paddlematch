import { Button, Result } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';

import { authContext } from '../AuthContext';
import styles from './LogoutPage.module.css';
import { useHistory } from 'react-router-dom';

export function LogoutPage() {

    const { logout } = useContext(authContext);
    const history = useHistory();

    useEffect(() => logout(), [logout]);

    const handleLoginClick = useCallback(() => {
        history.replace('/login');
    }, [history]);

    const handleCalendarClick = useCallback(() => {
        history.replace('/');
    }, [history]);

    return (
        <div className={styles.wrapper}>
            <Result
                status="success"
                title="Se desconectó exitosamente"
                extra={
                    <div className={styles.buttons}>
                        <Button type="primary" onClick={handleCalendarClick}>
                            Volver al calendario
                        </Button>
                        <Button onClick={handleLoginClick}>
                            Iniciar sesion
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
import { Alert, Button, Divider, Typography } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import React, { useCallback, useContext } from 'react';

import { RegisterForm } from './RegisterForm';
import { authContext } from '../AuthContext';
import { patchUserApi } from '../api';
import styles from './MyAccountPage.module.css';
import { useApi } from '../useApi';

export function MyAccountPage() {

    const { user, setUser } = useContext(authContext);
    const [putState, patchUser] = useApi(patchUserApi, setUser);
    const history = useHistory();

    const handleFinishUser = useCallback(({ name, mail, password }) => {
        const update = { userId: user.userId };
        if (name !== user.name)
            update.name = name;
        if (mail !== user.mail)
            update.mail = mail;
        if (password)
            update.password = password;

        patchUser({ path: { userId: user.userId } }, update, () => {
            if (mail !== user.mail)
                history.push('/verify-mail/send');
        });
    }, [patchUser, user, history]);

    return (
        <div className={styles.wrapper}>
            <h1>Mi cuenta</h1>

            {!user.verified &&
                <Alert
                    className={styles.alert}
                    type="warning"
                    showIcon
                    message={
                        <div>
                            ¡Dirección de correo electrónico no verificada! <Link to="/verify-mail/send">Enviar nuevamente</Link>
                        </div>
                    }
                />
            }

            <RegisterForm
                apiState={putState}
                onFinish={handleFinishUser}
                user={user}
            />

            <Divider />

            <h1>Opciones avanzadas </h1>
            <div className={styles.buttonWrapper}>
                <Button disabled>
                    Solicitar información
                </Button>
                <div>Recibirá un correo electrónico con una descripción general de todos sus datos guardados.</div>
            </div>
            <div className={styles.buttonWrapper}>
                <Button disabled>
                Eliminar todos los datos
                </Button>
                <Typography.Text type="danger">Esta acción no se puede deshacer.</Typography.Text>
                <div>Todos tus datos (reservas y cuenta de usuario) serán eliminados definitivamente.</div>
            </div>

        </div>
    );
}
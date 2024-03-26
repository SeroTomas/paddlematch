import { Button, Result, Space } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { postSendVerifyMailApi, postVerifyMailApi } from '../api';
import { useHistory, useParams } from 'react-router-dom';

import { Ball } from '../Ball';
import { ErrorResult } from '../ErrorResult';
import { authContext } from '../AuthContext';
import styles from './VerifyMailPage.module.css';
import { useApi } from '../useApi';

export function VerifyMailPage() {

    const { user, setUser } = useContext(authContext);
    const history = useHistory();
    const { verifyToken } = useParams();

    const send = verifyToken === 'send';
    const [sendState, sendMail] = useApi(postSendVerifyMailApi);
    const [verifyState, verifyMail] = useApi(postVerifyMailApi, setUser);
    const [resendClicked, setResendClicked] = useState(false);

    const handleCalendarClick = useCallback(() => {
        history.replace('/');
    }, [history]);

    const handleChangeMailClick = useCallback(() => {
        history.replace('/profile');
    }, [history]);

    const handleResendMail = useCallback(() => {
        setResendClicked(true);
        sendMail(null, { mail: user.mail });
    }, [sendMail, user.mail]);

    useEffect(() => {
        if (send)
            sendMail(null, { mail: user.mail });
    }, [send, sendMail, user.mail]);

    useEffect(() => {
        if (!send)
            verifyMail(null, { token: verifyToken });
    }, [send, verifyMail, verifyToken]);

    if (send)
        return (
            <div className={styles.wrapper}>
                <Result
                    status="info"
                    title="Por favor confirme su dirección de correo electrónico"
                    extra={
                        <div>
                            <div>
                                Verifique el correo enviado a <strong>{user?.mail}</strong>
                            </div>
                            <br />
                            <div>
                                Haga clic en el enlace de confirmación para verificar su dirección de correo electrónico.
                            </div>
                            <div className={styles.buttons}>
                                <Button
                                    type="link"
                                    onClick={handleResendMail}
                                    disabled={sendState.loading || resendClicked}
                                >
                                    Reenviar enlace de confirmación
                                </Button>
                                <Button type="link" onClick={handleChangeMailClick}>
                                    Cambiar dirección de correo electrónico
                                </Button>
                            </div>
                        </div>
                    }
                />
            </div>
        );

    if (verifyState.error)
        return <ErrorResult />

    if (verifyState.loading)
        return <Ball visible large spin />;

    return (
        <div className={styles.wrapper}>
            <Result
                status="success"
                title="Correo electrónico confirmado exitosamente."
                extra={
                    <Space direction="vertical" size="large">
                        <Button type="primary" onClick={handleCalendarClick}>
                            Ir al calendario
                        </Button>
                    </Space>
                }
            />
        </div>
    );
}
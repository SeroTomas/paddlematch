import { Button, Space, notification } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ExperimentOutlined } from '@ant-design/icons';
import { authContext } from '../AuthContext';
import { postLoginApi } from '../api';
import { useApi } from '../useApi';

export const demoControl = {};

export function DemoControls() {

    const { user, setUser } = useContext(authContext);
    const [open, setOpen] = useState(true);
    const [, login] = useApi(postLoginApi, setUser);

    const history = useHistory();
    demoControl.history = history;
    const location = useLocation();

    useEffect(() => {
        if (!open) {
            notification.close('demo');
            return;
        }

        notification.info({
            key: 'demo',
            message: 'Modo de prueba',
            duration: 0,
            placement: 'bottomRight',
            icon: <ExperimentOutlined />,
            onClose: () => setOpen(false),
            description: (
                <>
                    <p>Esta es una demostración llena de datos falsos.</p>
                    <Space direction="vertical">
                        {location.pathname === '/kiosk' ?
                            (
                                <Button size="middle" onClick={() => history.push('/')}>
                                    Salir de modo Kiosko
                                </Button>
                            ) : (
                                <>
                                    <Button size="middle" onClick={() => history.push('/kiosk')}>
                                        Modo Kiosko
                                    </Button>
                                    {user?.userId !== 2 &&
                                        <Button size="middle" onClick={() => login(null, {
                                            type: 'plain',
                                            mail: 'otto@example.com',
                                            password: 'demo',
                                        })}>
                                            Inicie sesión como administrador (Otto).
                                        </Button>
                                    }
                                    {user?.userId !== 9 &&
                                        <Button size="middle" onClick={() => login(null, {
                                            type: 'plain',
                                            mail: 'max@example.com',
                                            password: 'demo',
                                        })}>
                                            Inicie sesión como usuario (Max).
                                        </Button>
                                    }
                                </>
                            )
                        }
                        <Button size="middle" type="primary" onClick={() => setOpen(false)}>
                        Ocultar
                        </Button>
                    </Space>
                </>
            ),
        });
    }, [open, history, location, user, login]);

    if (!open)
        return (
            <Button 
                style={{ position: 'fixed', bottom: 5, right: 5 }}
                type="primary" 
                onClick={() => setOpen(true)}
            >
                Mostrar controles de prueba
            </Button>
        );

    return null;
}
import { Alert, Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import React, { useCallback, useContext } from 'react';

import { Link } from 'react-router-dom';
import { StatusText } from '../admin/StatusText';
import { authContext } from '../AuthContext';
import { postLoginApi } from '../api';
import styles from './LoginForm.module.css';
import { useApi } from '../useApi';

export function LoginForm() {

    const { autoLoginState, setUser, setRememberLogin } = useContext(authContext);
    const [loginState, login] = useApi(postLoginApi, setUser);

    const loading = loginState.loading || autoLoginState.loading;
    const valStatus = loginState.error ? 'error' : undefined;

    const onFinish = useCallback(({ mail, password, rememberLogin }) => {
        setRememberLogin(rememberLogin);
        login(null, {
            type: 'plain',
            mail,
            password,
        });
    }, [login, setRememberLogin]);

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
        >
            {loginState.error &&
                <Form.Item>
                    <Alert
                        type="error"
                        message="Error en el inicio de sesion."
                    />
                </Form.Item>
            }

            <Form.Item
                name="mail"
                rules={[{ required: true, message: 'El correo electrónico es requerido' }]}
                validateStatus={valStatus}
            >
                <Input
                    autoComplete="email"
                    prefix={<MailOutlined style={{ color: '#aaa' }} />}
                    placeholder="Correo electrónico"
                    disabled={loading}
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'La contraseña es requerida' }]}
                validateStatus={valStatus}
            >
                <Input.Password
                    autoComplete="current-password"
                    prefix={<LockOutlined style={{ color: '#aaa' }} />}
                    placeholder="Contraseña"
                    disabled={loading}
                />
            </Form.Item>

            <Form.Item>
                <Form.Item name="rememberLogin" valuePropName="checked" noStyle>
                    <Checkbox
                        disabled={loading}
                    >
                        Recordar contraseña
                    </Checkbox>
                </Form.Item>

                {/* TODO */}
                <Link className={styles.forgotLink} to="/reset-password">
                    Olvidé mi contraseña
                </Link>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginButton}
                    disabled={loading}
                >
                    <StatusText
                        loading={loading}
                        text={loading ? 'Iniciando...' : 'Iniciar sesion'}
                    />
                </Button>
            </Form.Item>


            <Form.Item className={styles.registerItem}>
                <Link to="/register">Registrarse gratis</Link>
            </Form.Item>
        </Form>
    );
}
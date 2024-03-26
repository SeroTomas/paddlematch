import { BulbOutlined, CalendarOutlined, CarryOutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import React, { useCallback, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { StatusText } from '../admin/StatusText';
import { authContext } from '../AuthContext';
import classNames from 'classnames/bind';
import styles from './MainMenu.module.css';

const cn = classNames.bind(styles);

export function MainMenu({
    horizontal = false,
    onClick,
}) {
    const { autoLoginState, user } = useContext(authContext);
    const { pathname } = useLocation();
    const history = useHistory();

    const handleClick = useCallback(({ key }) => {
        if (onClick)
            onClick(key);
        if (pathname !== key)
            history.push(key);
    }, [history, pathname, onClick]);

    const handleLoginClick = useCallback(() => {
        handleClick({ key: '/login' });
    }, [handleClick]);

    const handleRegisterClick = useCallback(() => {
        handleClick({ key: '/register' });
    }, [handleClick]);

    const handleLogoutClick = useCallback(() => {
        handleClick({ key: '/logout' });
    }, [handleClick]);

    /* Keys of Menu.Items match with the corresponding routes
     * in RouterSwitch to be able to map location.pathname directly
     * with the Menu.Item for that route => used to highlight the current item
     * via selectedKeys prop
     */
    return (
        <>
            <Menu
                className={cn({
                    menu: true,
                    horizontal
                })}
                mode={horizontal ? 'horizontal' : 'inline'}
                theme='light'
                selectedKeys={[pathname]}
                onClick={handleClick}
            >
                <Menu.Item key="/" icon={<CalendarOutlined />}>
                    Calendario de reservas
                </Menu.Item>

                {user &&
                    <Menu.Item key="/my-reservations" icon={<CarryOutOutlined />}>
                        Mis reservas
                    </Menu.Item>
                }

                <Menu.Item key="/info" icon={<BulbOutlined />}>
                    Sugerencias
                </Menu.Item>

                {user?.admin &&
                    <Menu.SubMenu
                        key="/admin"
                        title="Administración"
                        icon={<SettingOutlined />}
                    >
                        <Menu.Item key="/admin/general">
                            Ajustes generales
                        </Menu.Item>
                        <Menu.Item key="/admin/stats">
                            Estadísticas
                        </Menu.Item>
                        <Menu.Item key="/admin/users">
                            Gestión de usuarios
                        </Menu.Item>
                        <Menu.Item key="/admin/templates">
                            Plantillas de texto
                        </Menu.Item>
                    </Menu.SubMenu>
                }

                <span key="stretch" className={styles.stretch} />

                {user &&
                    <Menu.Item key="/profile" icon={<UserOutlined />}>
                        Mi Cuenta
                    </Menu.Item>
                }
            </Menu>

            {autoLoginState.loading &&
                <StatusText
                    className={cn({
                        menuButton: true,
                        horizontal,
                    })}
                    loading
                    text="Iniciando sesion"
                />
            }

            {user &&
                <Button
                    className={cn({
                        menuButton: true,
                        horizontal,
                    })}
                    onClick={handleLogoutClick}
                >
                    Cerrar sesion
                </Button>
            }

            {!user && !autoLoginState.loading &&
                <Button
                    className={cn({
                        menuButton: true,
                        horizontal,
                    })}
                    onClick={handleLoginClick}
                >
                    Iniciar sesion
                </Button>
            }

            {!user && !autoLoginState.loading &&
                <Button
                    className={cn({
                        menuButton: true,
                        horizontal,
                    })}
                    type="primary"
                    onClick={handleRegisterClick}
                >
                    Registrarse gratis
                </Button>
            }
        </>
    );
}
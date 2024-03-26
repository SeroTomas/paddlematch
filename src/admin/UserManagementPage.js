import { Button, Modal, Space, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MailOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { deleteUserApi, getUsersApi, patchUserApi } from '../api';

import { ErrorResult } from '../ErrorResult';
import { authContext } from '../AuthContext';
import styles from './UserManagementPage.module.css';
import { useApi } from '../useApi';

export function UserManagementPage() {

    const { user: { userId } } = useContext(authContext);

    const [users, setUsers] = useState([]);
    const [getState,] = useApi(getUsersApi, setUsers, true);
    const [deleteState, deleteUser] = useApi(deleteUserApi, setUsers);
    const [putState, patchUser] = useApi(patchUserApi, setUsers);

    // key prop is required for antd
    const keyedUsers = useMemo(() => users.map(u => ({ ...u, key: u.userId })), [users]);

    const handleDeleteUser = useCallback(userId => {
        deleteUser({ path: { userId } }, { userId });
    }, [deleteUser]);

    const handleSetAdmin = useCallback((userId, admin) => {
        patchUser({ path: { userId } }, {
            userId,
            admin,
        });
    }, [patchUser]);

    const columns = [
        {
            title: 'UserId',
            dataIndex: 'userId',
            key: 'userId',
            width: '5%',
            sorter: (a, b) => a.userId < b.userId ? -1 : 1,
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
            width: '10%',
            sorter: (a, b) => a.admin === b.admin ? 0 : (a.admin ? -1 : 1),
            render: (_, record) => (
                <div>
                    {record.admin ? "Si" : "No"}
                    <Tooltip title="Cambiar estado de administrador">
                        <Button
                            disabled={record.userId === userId}
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    title: record.admin ? '¿Revocar derechos de administrador?' : '¿Conceder derechos de administrador?',
                                    icon: <ExclamationCircleOutlined />,
                                    content: (
                                        <div>
                                            El usuario
                                            <br />
                                            <strong>{record.name} ({record.mail})</strong>
                                            <br />
                                            será a través de esta acción {record.admin ? 'degradado a un usuario normal.' : 'ascendido a administrador.'}
                                        </div>
                                    ),
                                    okText: record.admin ? 'retirar derechos' : 'Hazte administrador',
                                    okType: 'danger',
                                    cancelText: 'Cancelar',
                                    onOk() {
                                        handleSetAdmin(record.userId, !record.admin);
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'E-Mail',
            dataIndex: 'mail',
            key: 'mail',
            width: '25%',
            sorter: (a, b) => a.mail.localeCompare(b.mail),
        },
        {
            title: 'Verificado',
            dataIndex: 'verified',
            key: 'verified',
            width: '5%',
            sorter: (a, b) => a.verified === b.verified ? 0 : (a.verified ? -1 : 1),
            render: (_, record) => record.verified ? 'Si' : 'No',
        },
        {
            title: 'Última actividad',
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            width: '20%',
            sorter: (a, b) => a.lastActivity - b.lastActivity,
            render: (_, record) => record.lastActivity?.format('L LT'),
        },
        {
            title: 'Reservas (abiertas)',
            dataIndex: 'upcomingReservationCount',
            key: 'upcomingReservationCount',
            width: '5%',
            sorter: (a, b) => a.upcomingReservationCount - b.upcomingReservationCount,
        },
        {
            title: 'Reservas (totales)',
            dataIndex: 'totalReservationCount',
            key: 'totalReservationCount',
            width: '5%',
            sorter: (a, b) => a.totalReservationCount - b.totalReservationCount,
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space key={record._id}>
                    <Tooltip title="Enviar correo electrónico">
                        <Button
                            type="link"
                            icon={<MailOutlined />}
                            disabled={record.userId === userId}
                            onClick={() => {
                                window.location.href = `mailto:${record.mail}`;
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar usuario">
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={record.userId === userId}
                            onClick={() => {
                                Modal.confirm({
                                    title: '¿Borrar usuario?',
                                    icon: <ExclamationCircleOutlined />,
                                    content: (
                                        <>
                                            <div>Esta acción no se puede deshacer.</div>
                                            <div>Todos los datos y reservas serán eliminados irrevocablemente.</div>
                                            <br />
                                            <div>
                                                <strong>
                                                    Usuario: {record.name}
                                                    <br />
                                                    E-Mail: {record.mail}
                                                </strong>
                                            </div>
                                        </>
                                    ),
                                    okText: 'Borrar permanentemente',
                                    okType: 'danger',
                                    cancelText: 'Cancelar',
                                    onOk() {
                                        handleDeleteUser(record.userId);
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (getState.error || deleteState.error || putState.error)
        return <ErrorResult />

    return (
        <div className={styles.wrapper}>
            <h1>Gestión de usuarios</h1>
            <Table
                columns={columns}
                dataSource={keyedUsers}
                loading={getState.loading || deleteState.loading || putState.loading}
                scroll={{ x: 1300 }}
            />
        </div>
    )
}
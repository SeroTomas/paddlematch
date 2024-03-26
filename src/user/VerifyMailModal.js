import { Button, Modal, Result } from 'antd';
import React, { useCallback, useContext } from 'react';

import { authContext } from '../AuthContext';
import styles from './VerifyMailModal.module.css';
import { useHistory } from 'react-router-dom';

export function VerifyMailModal({
    onClose
}) {
    const { user } = useContext(authContext);
    const history = useHistory();

    const handleChangeMailClick = useCallback(() => {
        history.push('/profile');
    }, [history]);

    const handleResendMail = useCallback(() => {
        history.push('/verify-mail/send');
    }, [history]);

    return (
        <Modal
            title="Correo electrónico no verificado"
            visible={true}
            centered
            width={580}
            onCancel={onClose}
            onOk={onClose}
            footer={null}
        >
            <Result
                status="warning"
                title="Por favor confirme su dirección de correo electrónico"
                extra={
                    <div>
                        <div>
                            Haga clic en el enlace de confirmación enviado al correo <strong>{user?.mail}</strong>
                        </div>
                        <div className={styles.buttons}>
                            <Button type="primary" onClick={handleResendMail}>
                                Reenviar enlace de confirmación
                            </Button>
                            <Button type="link" onClick={handleChangeMailClick}>
                                Cambiar dirección de correo electrónico
                            </Button>
                        </div>
                    </div>
                }
            />
        </Modal>
    );
}
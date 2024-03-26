import { Button, notification } from 'antd';
import React, { useEffect } from 'react';

export function CookieNotice() {

    useEffect(() => {
        const closed = localStorage.getItem('notice-closed');

        if (closed)
            return;

        const close = () => {
            notification.close('cookie-notice');
            localStorage.setItem('notice-closed', 'true');
        };

        notification.info({
            key: 'cookie-notice',
            message: 'Aviso sobre Cookies',
            duration: 0,
            placement: 'bottomRight',
            description: (
                <>
                    <div>
                        Por motivos funcionales, se utiliza una tecnología alternativa a las cookies.
                    </div>
                    <div>
                        No se establecen cookies de seguimiento ni de terceros.
                    </div>
                </>
            ),
            onClose: close,
            btn: (
                <Button type="primary" size="middle" onClick={close}>
                    OK
                </Button>
            ),
            closeIcon: ' ',
        });
    }, []);

    return null;
}
import React, { useState } from 'react';

import { Ball } from '../Ball';
import { Divider } from 'antd';
import { ErrorResult } from '../ErrorResult';
import { MailTemplateEditor } from './MailTemplateEditor';
import { getMailTemplatesApi } from '../api';
import { useApi } from '../useApi';

export function MailTemplatesPane() {

    const [mailTemplates, setMailTemplates] = useState();
    const [state, ] = useApi(getMailTemplatesApi, setMailTemplates, true);

    if (state.error)
        return <ErrorResult />;

    if (state.loading)
        return <Ball visible spin centered large />;

    return (
        <>
            <h1>Confirmación de la reserva</h1>
            <MailTemplateEditor
                id='reservationConfirmation'
                mailTemplates={mailTemplates}
                setMailTemplates={setMailTemplates}
                replacements={[
                    {
                        key: '{{name}}',
                        description: 'Reemplazar con el nombre del usuario.',
                    },
                    {
                        key: '{{reservierung}}',
                        description: 'Reemplazar por los datos de la reserva realizada.',
                    }
                ]}
            />

            <Divider />

            <h1>Cancelación de la reserva</h1>
            <MailTemplateEditor
                id='reservationCancelled'
                mailTemplates={mailTemplates}
                setMailTemplates={setMailTemplates}
                replacements={[
                    {
                        key: '{{name}}',
                        description: 'Reemplazar con el nombre del usuario.',
                    },
                    {
                        key: '{{reservierung}}',
                        description: 'Reemplazar por los detalles de la reserva cancelada.',
                    },
                    {
                        key: '{{grund}}',
                        description: 'Reemplazar por el motivo de la cancelación.',
                    }
                ]}
            />

            <Divider />

            <h1>Registro: Confirmar correo electrónico</h1>
            <MailTemplateEditor
                id='confirmMail'
                mailTemplates={mailTemplates}
                setMailTemplates={setMailTemplates}
                replacements={[
                    {
                        key: '{{name}}',
                        description: 'Reemplazar con el nombre del usuario',
                    },
                    {
                        key: '{{link}}',
                        description: 'Reemplazar por el enlace de confirmación.',
                    },
                ]}
            />

            <Divider />

            <h1>Registro: Olvidé mi contraseña</h1>
            <MailTemplateEditor
                id='resetPassword'
                mailTemplates={mailTemplates}
                setMailTemplates={setMailTemplates}
                replacements={[
                    {
                        key: '{{name}}',
                        description: 'Reemplazar con el nombre del usuario',
                    },
                    {
                        key: '{{link}}',
                        description: 'Reemplazar por el enlace de reinicio de contraseña',
                    },
                ]}
            />

        </>
    );
}
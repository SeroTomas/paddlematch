import { Divider, Typography } from 'antd';

import { AnnouncementForm } from './AnnouncementForm';
import { CourtConfigForm } from './CourtConfigForm';
import React from 'react';
import { SystemConfigForm } from './SystemConfigForm';
import styles from './GeneralSettingsPage.module.css';

export function GeneralSettingsPage() {

    return (
        <div className={styles.wrapper}>

            <h1>Anuncio</h1>
            <AnnouncementForm />

            <Divider />

            <h1>Gestión de lugares</h1>
            <Typography.Text>
                El orden determina la visualización en el calendario de reservas.
            </Typography.Text>
            <br /><br />
            <CourtConfigForm />

            <Divider />

            <h1>Ajustes básicos</h1>
            <SystemConfigForm />

        </div>
    );
}
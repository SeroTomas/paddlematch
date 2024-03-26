import { MailTemplatesPane } from './MailTemplatesPane';
import React from 'react';
import { Tabs } from 'antd';
import { TemplateEditor } from './TemplateEditor';
import styles from './EditTemplatesPage.module.css';

export function EditTemplatesPage() {

    return (
        <div className={styles.wrapper}>
            <Tabs className={styles.tabs} type="card">

                <Tabs.TabPane tab="Sugerencias" key="2">
                    <div className={styles.content}>

                        <TemplateEditor id='infoPage' />

                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Informacion legal" key="i">
                    <div className={styles.content}>

                        <TemplateEditor
                            id='legalPrivacy'
                            extra={
                                <>
                                    <h2>Información legal</h2>
                                    <div>
                                        <div>La siguiente información debe incluirse en la declaración de protección de datos.</div>
                                        <ul>
                                            <li>
                                                El sistema utiliza tecnología similar a las cookies,
                                                para habilitar funciones básicas como el registro de usuarios.
                                            </li>
                                            <li>
                                                No se comparten datos con terceros
                                            </li>
                                            <li>
                                                No se establecen cookies de seguimiento.
                                            </li>
                                            <li>
                                                La aplicacion tiene un sistema de seguimiento incorporado,
                                                para contar páginas vistas, etc.
                                                <br />
                                                Para ello se evalúan las solicitudes al servidor.
                                                La información de la solicitud es individual.
                                                Se crea una identificacion digital para poder contar el número de visualizaciones en función de los diferentes usuarios.
                                                No se almacenan ni se comparten datos personales.
                                                La identificacion digital se renueva diariamente para que no se puedan crear perfiles de usuario de manera maliciosa.
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            }
                        />

                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Condiciones de reserva" key="1">
                    <div className={styles.content}>

                        <TemplateEditor
                            id='Reservaciones'
                            extra={
                                <>
                                    <div>Durante una reserva, se solicita al usuario que acepte las instrucciones/reglas anteriores.</div>
                                </>
                            }
                        />

                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Registro" key="7">
                    <div className={styles.content}>

                        <h1>Condiciones de uso</h1>
                        <TemplateEditor
                            id='systemTos'
                            extra='El usuario deberá aceptar estas condiciones de uso para poder registrarse.'
                        />

                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Plantillas de E-Mail" key="3">
                    <div className={styles.content}>

                        <MailTemplatesPane />

                    </div>
                </Tabs.TabPane>

            </Tabs>
        </div>
    );
}
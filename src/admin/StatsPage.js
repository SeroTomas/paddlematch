import { Card, Col, List, Radio, Row, Statistic } from 'antd';
import React, { useCallback, useState } from 'react';

import styles from './StatsPage.module.css';

export function StatsPage() {

    const [timePeriod, setTimePeriod] = useState(30);

    const [stats, ] = useState({
        perPage: [
            ['/', 62],
            ['/my-reservations', 42],
            ['/profile', 6],
        ],
        browser: [
            ['Chrome', 62],
        ],
        os: [
            ['Android', 20],
            ['Windows 10', 19],
            ['Mac OS', 18],
        ],
        referrer: [
            ['google', 20],
        ],
    });

    const handleTimePeriodChange = useCallback(e => {
        setTimePeriod(e.target.value);
    }, []);

    return (
        <div className={styles.wrapper}>

            <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col>
                    <h1>Nutzungstatistiken</h1>
                </Col>
                <Col>
                    <Radio.Group
                        onChange={handleTimePeriodChange}
                        value={timePeriod}
                        buttonStyle="solid"
                    >
                        <Radio.Button value={7}>7 Días</Radio.Button>
                        <Radio.Button value={30}>30 Días</Radio.Button>
                        <Radio.Button value={365}>1 año</Radio.Button>
                        <Radio.Button value={0}>Todo</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

            <br />

            <Row gutter={[16, 16]}>
                <Col xs={12} md={8}>
                    <Statistic
                        title="Nuevas reservas"
                        value={234}
                    />
                </Col>

                <Col xs={12} md={8}>
                    <Statistic
                        title="Reservas canceladas"
                        value={6}
                    />
                </Col>

                <Col xs={12} md={8}>
                    <Statistic
                        title="Reservas totales"
                        value={82}
                        suffix=" en período"
                    />
                </Col>

                <Col xs={12} md={8}>
                    <Statistic
                        title="Vistas de página"
                        value={1234}
                    />
                </Col>

                <Col xs={12} md={8}>
                    <Statistic
                        title="Visitantes"
                        value={123}
                        prefix="&#177;"
                    />
                </Col>

                <Col xs={12} md={8}>
                    <Statistic
                        title="Dispositivos móviles"
                        value={24}
                        suffix="%"
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>

                <Col xs={24} md={12}>
                    <Card title={<h3>Por página</h3>} bordered={true}>
                        <List>
                            {stats.perPage.map(([page, views]) => (
                                <List.Item key={page}>
                                    <span>{page}</span>
                                    <span className={styles.spacer} />
                                    <span>{views} Vistas</span>
                                </List.Item>
                            ))}
                        </List>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={<h3>Referente</h3>} bordered={true}>
                        <List>
                            {stats.referrer.map(([referrer, user]) => (
                                <List.Item key={referrer}>
                                    <span>{referrer}</span>
                                    <span className={styles.spacer} />
                                    <span>{user} Usuarios</span>
                                </List.Item>
                            ))}
                        </List>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={<h3>Buscador</h3>} bordered={true}>
                        <List>
                            {stats.browser.map(([browser, user]) => (
                                <List.Item key={browser}>
                                    <span>{browser}</span>
                                    <span className={styles.spacer} />
                                    <span>{user} Usuarios</span>
                                </List.Item>
                            ))}
                        </List>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={<h3>Sistemas operativos</h3>} bordered={true}>
                        <List>
                            {stats.os.map(([os, user]) => (
                                <List.Item key={os}>
                                    <span>{os}</span>
                                    <span className={styles.spacer} />
                                    <span>{user} Usuarios</span>
                                </List.Item>
                            ))}
                        </List>
                    </Card>
                </Col>

            </Row>

        </div>
    );
}
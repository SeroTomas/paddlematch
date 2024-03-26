import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ReservationDetails.module.css';

const cn = classNames.bind(styles);

export function ReservationDetails({
    court,
    date,
    inline = false,
    name,
    repeat,
    time,
}) {
    return (
        <div className={cn({
            wrapper: true,
            inline
        })}>
            {name &&
                <div className={styles.item}>
                    <div className={styles.title}>
                        <UserOutlined />&nbsp;Nombre
                    </div>
                    <div className={styles.content}>
                        {name}
                    </div>
                </div>
            }

            {date && 
                <div className={styles.item}>
                    <div className={styles.title}>
                        <CalendarOutlined />&nbsp;Fecha
                    </div>
                    <div className={styles.content}>
                        {date}
                    </div>
                </div>
            }

            {time &&
                <div className={styles.item}>
                    <div className={styles.title}>
                        <ClockCircleOutlined />&nbsp;Hora
                    </div>
                    <div className={styles.content}>
                        {time}
                    </div>
                </div>
            }

            {court &&
                <div className={styles.item}>
                    <div className={styles.title}>
                        <EnvironmentOutlined />&nbsp;Lugar
                    </div>
                    <div className={styles.content}>
                        {court}
                    </div>
                </div>
            }

            {repeat &&
                <div className={styles.item}>
                    <div className={styles.title}>
                        <RedoOutlined />&nbsp;Repetir
                    </div>
                    <div className={styles.content}>
                        {repeat}
                    </div>
                </div>
            }
        </ div>
    );
}
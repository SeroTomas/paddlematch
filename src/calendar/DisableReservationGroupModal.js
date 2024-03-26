import { Button, Form, Input, Modal, Radio, message } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { patchReservationGroupApi, postReservationGroupApi } from '../api';

import { DateTimeRangeSelect } from './DateTimeRangeSelect';
import { ErrorResult } from '../ErrorResult';
import { RESERVATION_TYPES } from '../ReservationTypes';
import { ReservationDetails } from './ReservationDetails';
import { ScrollRadioGroup } from './ScrollRadioGroup';
import { StatusText } from '../admin/StatusText';
import { appContext } from '../AppContext';
import dayjs from 'dayjs';
import { getCourtName } from '../helper';
import styles from './ReservationGroupModal.module.css';
import { useApi } from '../useApi';

export function DisableReservationGroupModal({
    initialFrom,
    initialCourtId,
    reservation,
    onFinish,
    setReservations: setOuterReservations,
}) {
    const { config: { visibleHours }, courts } = useContext(appContext);

    const [reason, setReason] = useState(reservation?.text || '');
    const [from, setFrom] = useState(() => reservation?.from || initialFrom.startOf('day'));
    const [to, setTo] = useState(() => reservation?.to || initialFrom.add(1, 'day').startOf('day'));
    const [courtId, setCourtId] = useState(reservation?.courtId || initialCourtId);
    const prevErrorRef = useRef({});

    const [postState, postReservationGroup] = useApi(postReservationGroupApi, setOuterReservations);
    const [patchState, patchReservationGroup] = useApi(patchReservationGroupApi, setOuterReservations);

    const loading = postState.loading || patchState.loading;
    const changed = reservation && (
        reservation.from !== from
        || reservation.to !== to
        || reservation.text !== reason
        || reservation.courtId !== courtId
    );

    const unavailableReservations = useMemo(() => {
        let uaRes = postState.error?.unavailableReservations || patchState.error?.unavailableReservations;
        if (uaRes)
            uaRes = uaRes.map(({ courtId, from, to }) => ({
                courtId,
                from: dayjs(from),
                to: dayjs(to),
            }));
        return uaRes;
    }, [patchState.error?.unavailableReservations, postState.error?.unavailableReservations]);

    const handleChangeReason = useCallback(e => {
        setReason(e.target.value);
    }, []);

    const handleCourtIdChange = useCallback(e => {
        setCourtId(e.target.value);
    }, []);

    const handleDisableCourt = useCallback(() => {
        const doDisable = () => {
            if (!reservation) {
                postReservationGroup(null, {
                    reservations: [{ courtId, from, to }],
                    text: reason,
                    type: RESERVATION_TYPES.DISABLE,
                }, () => {
                    message.success("Reserva exitosa");
                    onFinish();
                });
            } else {
                patchReservationGroup({
                    path: {
                        groupId: reservation.groupId
                    }
                }, {
                    reservations: [{ courtId, from, to }],
                    text: reason,
                }, () => {
                    message.success("Reserva exitosa");
                    onFinish();
                });
            }
        };

        let checkDate;
        if (from.hour() <= visibleHours[0])
            checkDate = from.hour(visibleHours[0]);
        else if (from.hour() >= visibleHours[1])
            checkDate = from.add(1, 'day').hour(visibleHours[0]);

        if (checkDate?.isSameOrAfter(to, 'hour')) {
            Modal.error({
                icon: false,
                title: 'Reserva no permitida',
                width: 530,
                centered: true,
                content: 'El Reserva está fuera del período mostrado.',
            });
        } else {
            Modal.confirm({
                icon: false,
                title: '¿Realmente bloquear?',
                okText: 'Sperren',
                okType: 'danger',
                width: 530,
                centered: true,
                content: 'Las reservas existentes que entren en conflicto con el bloqueo serán canceladas automáticamente. Los titulares de las reservas serán informados de ello vía correo electrónico.',
                onOk: doDisable,
            });
        }
    }, [courtId, from, onFinish, patchReservationGroup, postReservationGroup, reason, reservation, to, visibleHours]);

    const handleRemoveDisable = useCallback(() => {
        patchReservationGroup({
            path: {
                groupId: reservation.groupId
            }
        }, {
            reservations: [],
        }, () => {
            message.success("Bloqueo levantado");
            onFinish();
        });
    }, [onFinish, patchReservationGroup, reservation?.groupId]);

    useEffect(() => {
        if (prevErrorRef.current.post === postState.error
            && prevErrorRef.current.patch === patchState.error)
            return;
        prevErrorRef.current.post = postState.error;
        prevErrorRef.current.patch = patchState.error;

        if (unavailableReservations) {
            Modal.error({
                centered: true,
                title: 'Error de bloqueo',
                content: (
                    <div>
                        <div>
                            Ya existe un bloqueo para los siguientes periodos:
                        </div>
                        <ul>
                            {unavailableReservations.map(({ courtId, from, to }) => (
                                <li key={from}>{from.format('dd[\xa0]L,[\xa0]H[\xa0][Uhr]')} bis {to.format('dd[\xa0]L,[\xa0]H[\xa0][Uhr]')}, {getCourtName(courts, courtId)}</li>
                            ))}
                        </ul>
                    </div>
                )
            });
        }
    }, [courts, patchState.error, postState.error, unavailableReservations])

    if (
        (postState.error && !postState.error.unavailableReservations)
        || (patchState.error && !patchState.error.unavailableReservations)
    ) {
        return (
            <Modal
                title="Error de bloqueo"
                visible={true}
                centered
                onCancel={onFinish}
                onOk={onFinish}
                footer={
                    <div className={styles.footer}>
                        <Button onClick={onFinish}>
                            Cancelar
                        </Button>
                    </div>
                }
            >
                <div className={styles.wrapper}>
                    <ErrorResult />
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title="Espacio de bloque"
            visible={true}
            width={530}
            centered
            onCancel={onFinish}
            onOk={onFinish}
            footer={loading ?
                (
                    <StatusText
                        loading
                        text="Espere por favor..."
                    />
                ) : (
                    <div className={styles.footer}>
                        <Button onClick={onFinish}>
                            Cancelar
                        </Button>
                        {reservation &&
                            <Button
                                type="primary"
                                onClick={handleRemoveDisable}
                            >
                                Eliminar bloqueo
                            </Button>
                        }
                        <Button
                            disabled={reservation && !changed}
                            type="danger"
                            onClick={handleDisableCourt}
                        >
                            Bloqueo
                        </Button>
                    </div>
                )
            }
        >
            <div className={styles.wrapper}>
                <ReservationDetails
                    court={
                        <ScrollRadioGroup
                            disabled={loading}
                            onChange={handleCourtIdChange}
                            value={courtId}
                        >
                            {courts.map(({ courtId, name }) => (
                                <Radio.Button key={courtId} value={courtId}>{name}</Radio.Button>
                            ))}
                        </ScrollRadioGroup>
                    }
                    date={
                        <DateTimeRangeSelect
                            disabled={loading}
                            from={from}
                            to={to}
                            onFromChange={setFrom}
                            onToChange={setTo}
                        />
                    }
                />

                <Form layout="vertical">
                    <Form.Item
                        label="Grund der Sperrung"
                    >
                        <Input
                            disabled={loading}
                            onChange={handleChangeReason}
                            placeholder="Kein Grund"
                            value={reason}
                        />
                        <div className={styles.changeReasonHint}>
                        Las reservas existentes serán canceladas.
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
import { Button, Form, Input, Modal, Radio, message } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getReservationsApi, patchReservationGroupApi, postReservationGroupApi } from '../api';

import { Ball } from '../Ball';
import { ErrorResult } from '../ErrorResult';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { RESERVATION_TYPES } from '../ReservationTypes';
import { ReservationDetailsForm } from './ReservationDetailsForm';
import { StatusText } from '../admin/StatusText';
import { appContext } from '../AppContext';
import { authContext } from '../AuthContext';
import dayjs from 'dayjs';
import { getCourtName } from '../helper';
import styles from './ReservationGroupModal.module.css';
import { useApi } from '../useApi';

export function ReservationGroupModal({
    initialCourtId,
    initialFrom,
    initialTo,
    reservation,
    onFinish,
    setReservations: setOuterReservations,
}) {
    const { courts, templates: { reservationTos } } = useContext(appContext);
    const { user } = useContext(authContext);

    const [changeReason, setChangeReason] = useState('');
    const [text, setText] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [from, setFrom] = useState(reservation?.from || initialFrom);
    const [to, setTo] = useState(reservation?.to || initialTo);
    const [courtId, setCourtId] = useState(reservation?.courtId || initialCourtId);
    const prevErrorRef = useRef({});

    const [groupReservations, setGroupReservations] = useState([]);
    const [state, getGroupReservations] = useApi(getReservationsApi, setGroupReservations);

    const [postState, postReservationGroup] = useApi(postReservationGroupApi, setOuterReservations);
    const [patchState, patchReservationGroup] = useApi(patchReservationGroupApi, setOuterReservations);

    const loading = state.loading || postState.loading || patchState.loading;

    const adminEdit = reservation && user.admin && reservation?.userId !== user.userId;
    const canEdit = user.admin || !reservation || reservation.userId === user.userId;

    const newReservations = useMemo(() => reservations?.filter(
        r => !groupReservations.some(gr => gr.from.isSame(r.from, 'hour') && gr.to.isSame(r.to, 'hour'))
    ), [reservations, groupReservations]);
    const cancelReservations = useMemo(() => reservations && groupReservations.filter(
        gr => !reservations.some(r => r.from.isSame(gr.from, 'hour') && r.to.isSame(gr.to, 'hour'))
    ), [reservations, groupReservations]);
    const changeText = !!(groupReservations && text);

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

    useEffect(() => {
        if (reservation?.groupId)
            getGroupReservations({ query: { 'group-id': reservation?.groupId } });
    }, [reservation, getGroupReservations]);

    const handleChangeChangeReason = useCallback(e => {
        setChangeReason(e.target.value);
    }, []);

    const handlePostReservation = useCallback(() => {
        const doPost = () => {
            postReservationGroup(null, {
                reservations,
                text,
                type: RESERVATION_TYPES.NORMAL,
            }, () => {
                message.success("Reserva exitosa");
                onFinish();
            });
        };

        Modal.confirm({
            icon: false,
            okText: 'Aceptar',
            width: 530,
            centered: true,
            content: (
                <div dangerouslySetInnerHTML={{ __html: reservationTos.body }} />
            ),
            onOk: doPost,
        });
    }, [
        onFinish,
        postReservationGroup,
        reservations,
        reservationTos,
        text,
    ]);

    const handleChangeReservation = useCallback(() => {
        const doChange = () => {
            patchReservationGroup({
                path: {
                    groupId: reservation.groupId
                }
            }, {
                reason: adminEdit ? changeReason : undefined,
                reservations,
                text,
            }, () => {
                message.success("Guardado con éxito");
                onFinish();
            });
        };

        Modal.confirm({
            title: '¿Realmente quiere guardar?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            content: (
                <div className={styles.wrapper}>

                    {newReservations.length > 0 &&
                        <>
                            <div className={styles.heading}>Nuevas fechas</div>
                            <ul>
                                {newReservations.map(({ courtId, from, to }) => (
                                    <li key={from}>{from.format('dd[\xa0]L')}, {from.hour()}&nbsp;bis&nbsp;{to.hour()}&nbsp;hs, {getCourtName(courts, courtId)}</li>
                                ))}
                            </ul>
                        </>
                    }

                    {cancelReservations.length > 0 &&
                        <>
                            <div className={styles.heading}>Cancelar</div>
                            <ul>
                                {cancelReservations.map(({ courtId, from, to }) => (
                                    <li key={from}>{from.format('dd[\xa0]L')}, {from.hour()}&nbsp;bis&nbsp;{to.hour()}&nbsp;hs, {getCourtName(courts, courtId)}</li>
                                ))}
                            </ul>
                        </>
                    }

                    {changeText &&
                        <>
                            <div className={styles.heading}>Cambios</div>
                            <ul>
                                <li>Name: <strong>{text}</strong></li>
                            </ul>
                        </>
                    }

                </div>
            ),
            okText: 'Confirmar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: doChange
        });
    }, [
        adminEdit,
        cancelReservations,
        changeReason,
        changeText,
        courts,
        newReservations,
        onFinish,
        patchReservationGroup,
        reservation,
        reservations,
        text,
    ]);


    const handleCancelReservation = useCallback(() => {
        let cancelType = 'single';

        const handleCancelTypeChange = e => (cancelType = e.target.value);

        const doDelete = () => {
            const reqParams = {
                path: {
                    groupId: reservation.groupId
                }
            };
            const cb = () => {
                message.success("Cancelación exitosa");
                onFinish();
            }

            let reservations;
            if (cancelType === 'single') {
                reservations = groupReservations.filter(r => !r.from.isSame(reservation.from, 'day'));
            } else if (cancelType === 'allActive') {
                reservations = groupReservations.filter(r => r.from.isBefore(dayjs(), 'hour'));
            } else {
                reservations = [];
            }

            patchReservationGroup(reqParams, {
                reason: adminEdit ? changeReason : undefined,
                reservations,
            }, cb);
        };

        if (groupReservations.length <= 1) {
            doDelete();
        } else {
            Modal.confirm({
                title: 'Cancelar citas',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                content: (
                    <Radio.Group
                        className={styles.cancelRadioGroup}
                        onChange={handleCancelTypeChange}
                        defaultValue={cancelType}
                    >
                        <Radio value="single">solo esta cita</Radio>
                        <ul>
                            <li key={reservation.from}>{reservation.from.format('dd[\xa0]L')}, {reservation.from.hour()}&nbsp;bis&nbsp;{reservation.to.hour()}&nbsp;hs, {getCourtName(courts, reservation.courtId)}</li>
                        </ul>
                        <Radio value="allActive">Todas las citas abiertas</Radio>
                        <ul>
                            {groupReservations.filter(r => !r.from.isBefore(dayjs(), 'hour')).map(({ courtId, from, to }) => (
                                <li key={from}>{from.format('dd[\xa0]L')}, {from.hour()}&nbsp;bis&nbsp;{to.hour()}&nbsp;hs, {getCourtName(courts, courtId)}</li>
                            ))}
                        </ul>
                        {user?.admin &&
                            <>
                                <Radio value="all">Todas las citas</Radio>
                                <ul>
                                    {groupReservations.map(({ courtId, from, to }) => (
                                        <li key={from}>{from.format('dd[\xa0]L')}, {from.hour()}&nbsp;bis&nbsp;{to.hour()}&nbsp;hs, {getCourtName(courts, courtId)}</li>
                                    ))}
                                </ul>
                            </>
                        }
                    </Radio.Group>
                ),
                okText: 'Aceptar',
                okType: 'danger',
                cancelText: 'Cancelar',
                onOk: doDelete,
            });
        }
    }, [
        adminEdit,
        changeReason,
        courts,
        groupReservations,
        onFinish,
        patchReservationGroup,
        reservation,
        user?.admin,
    ]);

    useEffect(() => {
        if (prevErrorRef.current.post === postState.error
            && prevErrorRef.current.patch === patchState.error)
            return;
        prevErrorRef.current.post = postState.error;
        prevErrorRef.current.patch = patchState.error;

        const message = postState.error?.message || patchState.error?.message;
        if (unavailableReservations) {
            Modal.error({
                centered: true,
                title: 'Reserva fallida',
                content: (
                    <div>
                        <div>
                            Las siguientes fechas no están disponibles:
                        </div>
                        <ul>
                            {unavailableReservations.map(({ courtId, from, to }) => (
                                <li key={from}>{from.format('dd[\xa0]L')}, {from.hour()}&nbsp;bis&nbsp;{to.hour()}&nbsp;hs, {getCourtName(courts, courtId)}</li>
                            ))}
                        </ul>
                    </div>
                )
            });
        } else if (message === 'too many active reservations') {
            const value = postState.error?.value || patchState.error?.value;
            const max = postState.error?.max || patchState.error?.max;
            const diff = Math.abs(value - max);
            Modal.error({
                centered: true,
                title: 'Límite de reserva alcanzado',
                content: (
                    <div>
                        {reservations?.length > diff ?
                            (
                                <p>
                                    Por favor elimine al menos<strong>{diff}</strong> Eventos.
                                </p>
                            ) : (
                                <p>
                                    Actualmente no puede reservar más citas.
                                </p>
                            )
                        }
                        <p>
                            Pueden ser un maximo de {max} Las reservas deben hacerse con anticipación. No se tendrán en cuenta las citas anteriores.
                        </p>
                    </div>
                )
            });
        }
    }, [courts, reservations?.length, postState.error, patchState.error, unavailableReservations])

    if (
        state.error
        || (postState.error && !postState.error.unavailableReservations && postState.error.message !== 'too many active reservations')
        || (patchState.error && !patchState.error.unavailableReservations && patchState.error.message !== 'too many active reservations')
    ) {
        return (
            <Modal
                title="reserva"
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
                            Cerrar
                        </Button>
                        {canEdit && (reservation ?
                            (
                                <>
                                    <Button
                                        type="danger"
                                        onClick={handleCancelReservation}
                                        disabled={adminEdit && !changeReason}
                                    >
                                        Cancelar reserva
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleChangeReservation}
                                        disabled={
                                            !(newReservations?.length || cancelReservations?.length || changeText)
                                            || (adminEdit && !changeReason)
                                        }
                                    >
                                        Guardar
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    disabled={!newReservations?.length}
                                    type="primary"
                                    onClick={handlePostReservation}
                                >
                                    Reservas
                                </Button>
                            )
                        )}
                    </div>
                )
            }
        >
            <div className={styles.wrapper}>
                {state.loading ?
                    (
                        <Ball visible spin centered large />
                    ) : (

                        <ReservationDetailsForm
                            courtId={courtId}
                            currentReservations={groupReservations}
                            disabled={loading}
                            from={from}
                            onCourtIdChange={setCourtId}
                            onFromChange={setFrom}
                            onReservationsChange={setReservations}
                            onTextChange={setText}
                            onToChange={setTo}
                            readOnly={!canEdit}
                            text={text}
                            to={to}
                            unavailableReservations={unavailableReservations}
                        />
                    )
                }

                {adminEdit &&
                    <Form layout="vertical">
                        <Form.Item
                            label="La razon del cambio"
                            required
                        >
                            <Input.TextArea
                                autoSize
                                disabled={loading}
                                onChange={handleChangeChangeReason}
                                placeholder="Necesario"
                                required
                                value={changeReason}
                            />
                            <div className={styles.changeReasonHint}>
                                El titular de la reserva será informado de los cambios y el motivo de los mismos mediante correo electrónico.
                            </div>
                        </Form.Item>
                    </Form>
                }
            </div>
        </Modal>
    );
}
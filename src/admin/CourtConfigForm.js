import { Button, Form, Input, Modal, Space } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { SubmitButtons } from './SubmitButtons';
import { appContext } from '../AppContext';
import { putCourtsApi } from '../api';
import styles from './CourtConfigForm.module.css';
import { useApi } from '../useApi';

export function CourtConfigForm() {

    const { courts, setCourts } = useContext(appContext);
    const [disableReset, setDisableReset] = useState(true);
    const [state, putCourts] = useApi(putCourtsApi, setCourts);

    const [form] = Form.useForm();

    const initialValues = useMemo(() => ({ courts }), [courts]);

    const resetForm = useCallback(() => {
        form.resetFields();
        setDisableReset(true);
    }, [form]);

    useEffect(() => {
        form.resetFields();
    }, [form, courts]);

    const getNextId = useCallback(() => {
        const curCourts = form.getFieldValue('courts') || [];
        let maxId = 0;
        for (let c of [...courts, ...curCourts])
            maxId = Math.max(c.courtId, maxId);
        return maxId + 1;
    }, [courts, form]);

    const handleFieldsChange = useCallback(() => {
        if (disableReset)
            setDisableReset(false);
    }, [disableReset]);

    const handleSave = useCallback(({ courts }) => {
        Modal.confirm({
            title: '¡Peligro!',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            content: (
                <div>
                    <p>El cambio de asiento puede provocar la pérdida de las reservas existentes.</p>
                    <p>Todas las reservas que se produzcan durante un período de bloqueo se cancelarán automáticamente.</p>
                    <p>Esto también se aplica a la eliminación de un lugar.</p>
                    <p>Todos los usuarios afectados por una cancelación serán informados por correo electrónico.</p>
                </div>
            ),
            okText: 'Confirmar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                putCourts(null, courts, resetForm);
            },
        });
    }, [putCourts, resetForm]);

    return (
        <Form
            autoComplete="off"
            form={form}
            initialValues={initialValues}
            layout="vertical"
            onFieldsChange={handleFieldsChange}
            onFinish={handleSave}
        >
            <Form.List name="courts">
                {(fields, { add, remove, move }) => (
                    <>
                        {fields.map((field, i) => (
                            <div key={field.key} className={styles.court}>
                                <Space>
                                    <Form.Item
                                        {...field}
                                        key="courtId"
                                        label="ID"
                                        name={[field.name, 'courtId']}
                                        // name={'courtId'}
                                        fieldKey={[field.fieldKey, 'courtId']}
                                    >
                                        <Input
                                            disabled
                                            bordered={false}
                                            className={styles.courtIdInput}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        key="name"
                                        label="Name"
                                        name={[field.name, 'name']}
                                        fieldKey={[field.fieldKey, 'name']}
                                        rules={[{ required: true, message: 'Nombre requerido' }]}
                                    >
                                        <Input placeholder="Ejemplo: club aeronautico" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Desplazar"
                                    >
                                        <Space>
                                            <Button
                                                onClick={() => move(i, i - 1)}
                                                icon={<CaretUpOutlined />}
                                            />
                                            <Button
                                                onClick={() => move(i, i + 1)}
                                                icon={<CaretDownOutlined />}
                                            />
                                            <Button
                                                onClick={() => remove(field.name)}
                                                danger
                                                icon={<DeleteOutlined />}
                                            />
                                        </Space>
                                    </Form.Item>
                                </Space>
                            </div>
                        ))}

                        <Form.Item key="add">
                            <Button
                                type="dashed"
                                onClick={() => add({ courtId: getNextId() })}
                                block
                                icon={<PlusOutlined />}
                            >
                                Agregar lugar
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <SubmitButtons
                    apiState={state}
                    disableReset={disableReset}
                    onReset={resetForm}
                />
            </Form.Item>
        </Form>
    );
}
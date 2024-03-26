import { Form, Input, InputNumber, Slider } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { SubmitButtons } from './SubmitButtons';
import { appContext } from '../AppContext';
import { isTimeZoneValid } from '../helper';
import { patchConfigApi } from '../api';
import { useApi } from '../useApi';

const TIMEZONE_LIST_LINK = 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones';

const sliderMarks = Array.from(Array(25)).reduce((marks, _, i) => {
    marks[i] = i % 24; 
    return marks;
}, {})

export function SystemConfigForm() {

    const { config, setConfig } = useContext(appContext);
    const [disableReset, setDisableReset] = useState(true);
    const [state, patchConfig] = useApi(patchConfigApi, setConfig);

    const [form] = Form.useForm();

    const resetForm = useCallback(() => {
        form.resetFields();
        setDisableReset(true);
    }, [form]);

    useEffect(() => {
        resetForm();
    }, [config, resetForm]);

    const handleFieldsChange = useCallback(() => {
        if (disableReset)
            setDisableReset(false);
    }, [disableReset]);

    const handleSave = useCallback(values => {
        patchConfig(null, values, resetForm);
    }, [patchConfig, resetForm]);

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={config}
            onFinish={handleSave}
            onFieldsChange={handleFieldsChange}
        >
            <Form.Item
                name="url"
                label="URL del sistema de reservas"
                rules={[{ required: true, message: 'La URL es obligatoria' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="orgName"
                label="Nombre del club"
                rules={[{ required: true, message: 'Se requiere el nombre del club' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="timeZone"
                label={<span>Huso horario (<a href={TIMEZONE_LIST_LINK} target="_blank" rel="noreferrer">Nombres de usos horario</a>)</span>}
                rules={[
                    { required: true, message: 'Se requiere zona horaria' },
                    { 
                        validator(_, value) {
                            if (!isTimeZoneValid(value))
                                return Promise.reject('Zona horaria no válida');
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="serverMail"
                label="Dirección de correo electrónico utilizado"
                rules={[
                    { type: 'email', message: 'Beispiel: mustermann@web.de' },
                    { required: true, message: 'E-Mail es necesario' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="reservationDaysInAdvance"
                label="Número de días que se pueden reservar con antelación"
                rules={[{ required: true, message: 'Se requiere información' }]}
            >
                <InputNumber 
                    min={1}
                    max={1825}
                />
            </Form.Item>

            <Form.Item
                name="reservationMaxActiveCount"
                label="Número máximo de reservas abiertas que un usuario puede realizar"
                rules={[{ required: true, message: 'Se requiere información' }]}
            >
                <InputNumber 
                    min={1}
                />
            </Form.Item>

            <Form.Item
                name="visibleHours"
                label="Horarios mostrados en el calendario."
                rules={[{ required: true, message: 'Se requiere información' }]}
            >
                <Slider 
                    marks={sliderMarks}
                    range
                    min={0}
                    max={24}
                />
            </Form.Item>

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
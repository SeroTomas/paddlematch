import { Alert, Button, Checkbox, Form, Input } from 'antd';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { StatusText } from '../admin/StatusText';
import { SubmitButtons } from '../admin/SubmitButtons';
import { appContext } from '../AppContext';
import styles from './RegisterForm.module.css';

export function RegisterForm({
    apiState = {},
    onFinish,
    user,
}) {
    const { templates: { systemTos } } = useContext(appContext);

    const [form] = Form.useForm();
    const [disableReset, setDisableReset] = useState(true);
    const loading = apiState.loading;
    const errorMailValueRef = useRef(null);

    const resetForm = useCallback(() => {
        form.resetFields();
        setDisableReset(true);
    }, [form]);

    useEffect(() => {
        resetForm();
    }, [resetForm, user]);

    useEffect(() => {
        if (apiState.success)
            resetForm();
        if (apiState.error) {
            errorMailValueRef.current = form.getFieldValue('mail');
            form.validateFields();
        }
    }, [form, apiState, resetForm]);

    const handleFieldsChange = useCallback(() => {
        if (disableReset)
            setDisableReset(false);
    }, [disableReset]);

    return (
        <Form
            form={form}
            className={styles.form}
            layout="vertical"
            onFinish={onFinish}
            onFieldsChange={handleFieldsChange}
        >
            {apiState.error &&
                <Form.Item>
                    <Alert
                        type="error"
                        message="Registro fallido."
                    />
                </Form.Item>
            }

            <Form.Item
                label="Nombre"
                name="name"
                initialValue={user?.name}
                rules={[
                    // { max: 20, message: 'Maximal 20 Zeichen erlaubt' },
                    // { min: 5, message: 'Mindestens 5 Zeichen erforderlich' },
                    { required: true, message: 'El nombre es requerido' },
                    {
                        pattern: /^[\u00c0-\u017eA-Za-z0-9.]{1}[\u00c0-\u017eA-Za-z0-9\s.]{3,18}[\u00c0-\u017eA-Za-z0-9.]{1}$/,
                        message: 'Entre 5 y 20 caracteres compuestos por: letras, números, puntos y espacios (excepto al principio/final)'
                    },
                ]}
            >
                <Input
                    autoComplete="name"
                    disabled={loading}
                />
            </Form.Item>

            <Form.Item
                name="mail"
                label="E-Mail"
                initialValue={user?.mail}
                rules={[
                    { type: 'email', message: 'Ejemplo: xxxxx@xxxxx.com' },
                    { required: true, message: 'La dirección de correo electrónico es obligatoria.' },
                    {
                        required: true,
                        validator(_, value) {
                            if (apiState.status === 400
                                && apiState.error?.message === 'mail already registered'
                                && value === errorMailValueRef.current)
                                return Promise.reject('El correo electrónico ya está registrado.');
                            return Promise.resolve();
                        },
                    }
                ]}
            >
                <Input
                    autoComplete="email"
                    disabled={loading}
                />
            </Form.Item>

            <Form.Item
                label={user ? "Nueva contraseña" : "Contraseña"}
                name="password"
                rules={[
                    {
                        required: true,
                        validator(_, value) {
                            if (
                                (value?.length > 0 && value?.length < 8)
                                || (!user && !value)
                            )
                                return Promise.reject('Se requieren al menos 8 caracteres');
                            return Promise.resolve();
                        },
                    }
                ]}
            >
                <Input.Password
                    autoComplete="new-password"
                    placeholder={user ? "No cambiar" : "Minimo 8 caracteres"}
                    disabled={loading}
                />
            </Form.Item>

            <Form.Item
                label="confirmar Contraseña"
                name="password-confirm"
                dependencies={['password']}
                rules={[
                    ({ getFieldValue }) => ({
                        required: true,
                        validator(_, value) {
                            const pwVal = getFieldValue('password');
                            if (pwVal === value || (!pwVal && !value))
                                return Promise.resolve();
                            return Promise.reject('¡Las contraseñas no coinciden!');
                        },
                    })
                ]}
            >
                <Input.Password
                    autoComplete="new-password"
                    placeholder={user ? "No cambiar" : "Minimo 8 caracteres"}
                    disabled={loading}
                />
            </Form.Item>

            {!user &&
                <>
                    <div>
                        <h1>Condiciones de uso</h1>
                        <div dangerouslySetInnerHTML={{ __html: systemTos.body }} />
                    </div>

                    <Form.Item
                        name="Aceptar"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject('Necesario aceptar los términos y condiciones'),
                            },
                        ]}
                    >
                        <Checkbox
                            disabled={loading}
                        >
                            Acepto los términos y condiciones
                             </Checkbox>
                    </Form.Item>
                </>
            }

            <Form.Item>
                {!user ?
                    (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                        >
                            <StatusText
                                loading={loading}
                                text={loading ? 'Registrando...' : 'Registrarse'}
                            />
                        </Button>
                    ) : (
                        <SubmitButtons
                            apiState={apiState}
                            disableReset={disableReset}
                            onReset={resetForm}
                        />
                    )
                }
            </Form.Item>
        </Form>
    );
}
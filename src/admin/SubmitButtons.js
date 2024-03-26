import { Button, Col, Row } from 'antd';

import { StatusText } from './StatusText';

function SubmitButtonsState({ apiState }) {
    const { success, loading, error } = apiState;

    if (loading)
        return (
            <StatusText
                loading
                text="Guardar"
            />
        );

    if (error)
        return (
            <StatusText
                error
                text="No se pudo guardar"
            />
        );

    if (success)
        return (
            <StatusText
                success
                text="Guardado"
            />
        );

    return null;
}

export function SubmitButtons({
    apiState = {},
    disableReset,
    onSave,
    onReset,
}) {
    return (
        <Row gutter={[16, 16]} align="middle">
            <Col>
                <Button 
                    disabled={apiState.loading}
                    onClick={onSave}
                    type="primary" 
                    htmlType="submit"
                >
                    Guardar
                </Button>
            </Col>
            <Col>
                <Button 
                    disabled={apiState.loading || disableReset}
                    onClick={onReset}
                    htmlType="reset"
                >
                    Restablecer los valores predeterminados
                </Button>
            </Col>
            <Col>
                <SubmitButtonsState apiState={apiState} />
            </Col>
        </Row>
    );
}
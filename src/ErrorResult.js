import { Button, Result } from 'antd';

export function ErrorResult() {

    return (
        <Result
            style={{ margin: '0 auto' }}
            status="warning"
            title="Algo salió mal."
            extra={
                <Button type="primary" onClick={() => window.location.reload()} >
                    Recargar página
                </Button>
            }
        />
    )

}
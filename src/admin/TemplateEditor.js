import React, { useCallback, useContext } from 'react';

import { BaseTemplateEditor } from './BaseTemplateEditor';
import { appContext } from '../AppContext';
import { putTemplateApi } from '../api';
import { useApi } from '../useApi';

export function TemplateEditor({
    id,
    extra,
    replacements,
}) {

    const { templates, setTemplates } = useContext(appContext);

    const data = templates[id];

    const [state, putTemplate] = useApi(putTemplateApi, setTemplates);

    const save = useCallback(({ cleanBody }) => {
        putTemplate({ path: { id } }, {
            id,
            body: cleanBody,
        });
    }, [id, putTemplate]);

    return (
        <BaseTemplateEditor
            apiState={state}
            extra={extra}
            initialBody={data?.body}
            onSave={save}
            replacements={replacements}
        />
    );
}
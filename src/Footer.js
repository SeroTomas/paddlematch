import React from 'react';

import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export function Footer({
    noLinks,
}) {

    const version = process.env.REACT_APP_VERSION;

    return (
        <>
            {!noLinks &&
                <p>
                    <Link to="/legalnotice-privacy">Pie de pagina / Informacion legal</Link>
                </p>
            }
            <p>
                {`©${dayjs().format('YYYY')} - v ${version} `} Desarrollado por C.B
            </p>
        </>
    );
}
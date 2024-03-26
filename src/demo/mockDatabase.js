import { RESERVATION_TYPES } from '../ReservationTypes';
import dayjs from 'dayjs';

const today = dayjs().startOf('day');

export const db = {

    config: {
        announcement: 'Este es un anuncio de muestra.\n Se puede configurar un anuncio como administrador en Administración -> Ajustes generales.',
        visibleHours: [8, 22],
        orgName: 'Paddle Match',
        serverMail: 'abc@def.de',
        url: 'https://reservierung.xyz.de',
        reservationDaysInAdvance: 90,
        reservationMaxActiveCount: 10,
        // timeZone: 'Europe/Berlin',
        timeZone: dayjs.tz.guess(),
    },

    mailTemplates: {
        reservationConfirmation: {
            subject: 'Confirmación de reservación- Paddle Match',
            body: `Hola {{name}}.<div><br>Acabas de realizar la siguiente reserva:<br><br>{{reservierung}}<br><br>Una reserva vinculante sólo se realiza cuando el token es confirmado.<br>No se pueden derivar reclamos legales por sistema de reservas.<br><br>Puedes obtener los tokens y el código de acceso de nuestros socios:<br>xyz<br><br>---</div><div><br></div><div>Paddle Match&nbsp;</div>`
        },
        reservationCancelled: {
            subject: 'Cancelación de su reserva - Paddle Match',
            body: `Hola {{name}}.<div><br>Tu reserva acaba de ser cancelada:<br><br>{{reservierung}}<br><br>Motivo de la cancelación:</div><div><br></div><div>{{grund}}<br><br><br>---</div><div><br></div><div>Paddle Match&nbsp;</div>`
        },
        confirmMail: {
            subject: 'Registro: Confirma tu email- Paddle Match',
            body: `Hola {{name}}.<div><br>Por favor confirme su dirección de correo electrónico haciendo clic en el siguiente enlace:<br><br>{{link}}<br></div><div><br></div><div>---</div><div><br></div><div>Paddle Match&nbsp;</div>`
        },
        resetPassword: {
            subject: 'restablecer la contraseña - Paddle Match',
            body: `Hola {{name}}.<div><br>Haga clic en el siguiente enlace para restablecer su contraseña:<br><br>{{link}}<br><br></div><div>---</div><div><br></div><div>Paddle Match&nbsp;</div>`
        },
    },

    templates: {
        reservationTos: {
            body: `<h1>Precio</h1><div>15,- Euros por ficha<br>145,- Euros por 10 fichas<br></div><div><br></div><h1>Condiciones de uso</h1><ul>
    <li>
    Para usarlo necesitas tokens y un código de acceso. Puede obtenerlos de nuestros socios: <br>
xyz asfdlkafsd, asdfkj 012387878 <br>
xbasdfyz aad, asdfkj 129388 8123 <br>
    </li>
    <li>
    Hay una cerradura con código en la entrada de la cancha en la que se debe ingresar un código numérico de 4 dígitos para activar la puerta.
    </li>
    <li>
    Hay una máquina de fichas para cada cancha. Un token enciende la luz durante 1 hora (+ un cierto retraso) y habilita el control de la calefacción.
    </li>
    <li>
    El uso después de las 22 horas y antes de las 8 horas es posible sin reservas.
    </li>
    <li>
    No se pueden derivar reclamamos legales por el sistema de reservas.
    </li>
</ul>`
        },
        systemTos: {
            body: `<ul>
    <li>
    No se pueden derivar reclamamos legales por el sistema de reservas.
    </li>
    <li>
    Su nombre se mostrará públicamente en el calendario de reservas.
    </li>
    <li>
    Usted acepta que se utilice una tecnología similar a las cookies para garantizar la funcionalidad del sistema. No hay seguimiento, etc.
    </li>
    <li>
    Puedes ver y eliminar permanentemente tus datos guardados (cuenta de usuario, reservas) en cualquier momento.
    </li>
    <li>
    Su correo electrónico se utilizará para confirmar reservas y notificarle si es necesario. Su correo electrónico no será compartido con terceros.
    </li>
</ul>`
        },
        infoPage: {
            body: `<h1>Información general sobre el uso de la sala</h1><div><br><ul><li>Este es un sistema de reservas</li><li>Una reserva vinculante sólo se realiza cuando el token se inserta en la máquina de tokens.</li><liNo se pueden derivar reclamamos legales por el sistema de reservas.</li><li>No es necesario utilizar este sistema de reservas. También puedes utilizar la sala sin reserva, pero ten en cuenta que las reservas tienen prioridad.</li><li>También es posible utilizarlo después de las 22:00 horas y antes de las 8:00 horas. Estos horarios rara vez se solicitan y, por lo tanto, no figuran en el plan de reserva para mayor claridad.</li><li>Hay una cerradura con código en la entrada de la cancha en la que se debe ingresar un código numérico de 4 dígitos para activar la puerta.</li><li>Hay una máquina de fichas para cada cancha. Un token enciende la luz durante 1 hora (+ un cierto retraso) y habilita el control de la calefacción.</li><li>Puedes obtener los tokens y el código de acceso de nuestros socios:</li><li>hotel relexa Harz-Wald Braunlage, Karl-Röhrig Str. 5a, Tel. 05520/8070</li><li>BTG Braunlage (información turística), Elbingeröderstr.</li><li>Una ficha cuesta 15 euros</li><li>10 fichas cuestan 145 euros</li><li>No hay suscripción en el sentido real, sólo el descuento por 10 tokens o más.</li><li>Si necesita mucho más, por ejemplo, reservar todo el salón para un fin de semana, contáctenos.</li></ul></div><div><br></div><h1>Uso del sistema de reservas</h1><div><ul><li>¿Nuevo aquí?<br>Antes de poder utilizar el sistema de reservas, debes registrarte.</li><li>¿Cómo reservo una hora?<br>Simplemente haga clic en la hora deseada. Si no ha iniciado sesión regístrate y podrás reservar la hora que quieras simplemente haciendo clic sobre él.</li><li>¿Cómo cancelo una reserva?<br>Puedes cancelar reservas simplemente haciendo clic en la reserva. Sólo puedes cancelar tus propias reservas. Debes iniciar sesión para hacer esto.</li><li>¿Qué restricciones hay para las reservas?<br>Las reservas se pueden realizar con un máximo de 3 meses de antelación.</li><li>Cambiar contraseña, correo electrónico o nombre de usuario<br>Puedes cambiar tus datos en “Mi cuenta de usuario”.</li><li>GDPR: Eliminar/solicitar datos<br>Puedes solicitar todos tus datos en “Mi Cuenta de Usuario”.</li></ul></div>`,
        },
        legalPrivacy: {
            body: `<h1>Impressum</h1><h1>Protección de Datos</h1>`,
        },
    },

    courts: [
        {
            courtId: 1,
            name: 'Club 1',
        },
        {
            courtId: 2,
            name: 'Club 2',
        },
        // {
        //     courtId: 2,
        //     name: 'Platz 3',
        // }
    ],

    users: [
        {
            userId: 9,
            name: 'Max Mustermann',
            mail: 'max@example.com',
            verified: true,
            admin: false,
            registeredAt: dayjs(),
        },
        {
            userId: 2,
            name: 'Otto Probiermal',
            mail: 'otto@example.com',
            verified: true,
            admin: true,
            registeredAt: dayjs(),
        },
        {
            userId: 3,
            name: 'Jürgen M.',
            mail: 'juergen@example.com',
            verified: true,
            admin: false,
            registeredAt: dayjs(),
        },
        {
            userId: 8,
            name: 'H. Müller',
            mail: 'mueller@example.com',
            verified: true,
            admin: false,
            registeredAt: dayjs(),
        },
        {
            userId: 661,
            name: 'Nick Sample',
            mail: 'test.franz.mein.mail@franz.de',
            verified: true,
            admin: false,
            registeredAt: dayjs(),
        },
        {
            userId: 41,
            name: 'Franz Test',
            mail: 'test.franz.mein.mail@franz.de',
            verified: false,
            admin: false,
            registeredAt: dayjs(),
        }
    ],

    // primary key: id auto inc
    // foreign key: groupId
    reservations: [
        {
            id: 0,
            from: today.add(-1, 'day').hour(11),
            to: today.add(+3, 'day').hour(20),
            courtId: 2,
            groupId: 0,
            created: today.add(-2, 'day').hour(11),
        },
        {
            id: 1,
            from: today.add(-1, 'day').hour(11),
            to: today.add(-1, 'day').hour(12),
            courtId: 1,
            groupId: 1,
            created: today.add(-2, 'day').hour(11),
        },
        {
            id: 2,
            from: today.add(3, 'day').hour(20),
            to: today.add(3, 'day').hour(21),
            courtId: 1,
            groupId: 3,
            created: today.add(-2, 'day').hour(11),
        },
        {
            id: 3,
            from: today.add(-2, 'day').hour(15),
            to: today.add(-2, 'day').hour(16),
            courtId: 1,
            groupId: 2,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 4,
            from: today.add(-1, 'day').hour(15),
            to: today.add(-1, 'day').hour(16),
            courtId: 1,
            groupId: 2,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 5,
            from: today.add(-0, 'day').hour(15),
            to: today.add(-0, 'day').hour(16),
            courtId: 1,
            groupId: 2,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 6,
            from: today.add(1, 'day').hour(15),
            to: today.add(1, 'day').hour(16),
            courtId: 1,
            groupId: 2,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 7,
            from: today.add(0, 'day').hour(17),
            to: today.add(0, 'day').hour(18),
            courtId: 1,
            groupId: 4,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 8,
            from: today.add(7, 'day').hour(17),
            to: today.add(7, 'day').hour(18),
            courtId: 1,
            groupId: 4,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 9,
            from: today.add(14, 'day').hour(17),
            to: today.add(14, 'day').hour(18),
            courtId: 1,
            groupId: 4,
            created: today.add(-4, 'day').hour(11),
        },
        {
            id: 10,
            from: today.add(21, 'day').hour(17),
            to: today.add(21, 'day').hour(18),
            courtId: 1,
            groupId: 4,
            created: today.add(-4, 'day').hour(11),
        },
    ],

    // primary key: groupId auto_inc
    reservationGroups: [
        {
            groupId: 0,
            userId: null,
            text: "trabajo de enfermería",
            type: RESERVATION_TYPES.DISABLE,
        },
        {
            groupId: 1,
            userId: 9,
            text: null,
            type: RESERVATION_TYPES.NORMAL,
        },
        {
            groupId: 3,
            userId: 9,
            text: null,
            type: RESERVATION_TYPES.NORMAL,
        },
        {
            groupId: 2,
            userId: 3,
            text: null,
            type: RESERVATION_TYPES.NORMAL,
        },
        {
            groupId: 4,
            userId: 2,
            text: null,
            type: RESERVATION_TYPES.NORMAL,
        },
    ]
};

window.getFakeDb = () => {
    return db;
};

window.addFakeReservation = () => {
    db.reservationGroups.push({
        groupId: 999,
        userId: 2,
        text: 'Fake',
        type: RESERVATION_TYPES.NORMAL,
    });

    db.reservations.push({
        from: today.hour(8),
        to: today.hour(9),
        courtId: 1,
        groupId: 999,
        created: today,
    });
}

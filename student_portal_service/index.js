require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentails = require('./config/corsCredentials');
const cookieParser = require('cookie-parser');
const handleVerifyJwt = require('./middleware/verifyJwtToken');
const handleUserActivities = require('./middleware/logActivities');
const path = require('path');
const handleUserAuthActivitiesAudit = require('./middleware/userAuthActivitiesAudit');
const http = require('http');
const { Server } = require('socket.io');
const fsPromises = require('fs').promises;
const handleCreateId = require('./utilities/createId');

const mainSocket = require('./socket/socket');

const userDB = {
  users: require('./data/user.json'),
  setUsers(data) {
    this.users = data;
  },
};

const notificationDB = {
  notifications: require('./data/notifications.json'),
  setNotifications(data) {
    this.notifications = data;
  },
};

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

const staticPath = path.join(__dirname, 'public');

const PORT = process.env.PORT || 3500;

app.use(credentails);
app.use(cors(corsOptions));

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(handleUserActivities);
app.use('/register', require('./routes/api/register'));

app.use('/login', require('./routes/api/auth'));

app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(
  '/dashboard',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/dashboard')
);

app.use(
  '/create-user',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/users/createUser')
);
app.use(
  '/get-users',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/users/getUsers')
);
app.use(
  '/edit-user',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/users/updateUser')
);
app.use(
  '/get-user',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/users/getUserId')
);
app.use(
  '/delete-user',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/users/deleteUser')
);
app.use(
  '/add-task',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/tasks/createTask')
);
app.use(
  '/tasks',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/tasks/getTasks')
);
app.use(
  '/edit-task',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/tasks/updateTask')
);
app.use(
  '/get-task',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/tasks/getTaskId')
);
app.use(
  '/delete-task',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/tasks/deleteTask')
);

app.use(
  '/get-notification',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/notifications/getNotifications')
);

app.use(
  '/unread-notification',
  handleUserAuthActivitiesAudit(),
  require('./routes/api/notifications/createUnreadNotifications')
);

// io.on('connection', (socket) => {
//   console.log('\x1b[35m%s\x1b[4m', 'connection established');

//   socket.on('send_notification', ({ notificationFormData, sender }) => {
//     const senderLookUp = { 1986: 'Admin', 2001: 'User', 2024: 'Student' };

//     const username = notificationFormData?.to;

//     const foundUsername = userDB.users.find(
//       (person) => person.username === username
//     );

//     if (!foundUsername) {
//       io.emit('response', {
//         status: 'error',
//         message: `Username ${notificationFormData?.to} is not a User`,
//       });
//     } else {
//       io.emit('response', {
//         status: 'success',
//         message: 'Notification Sent Successfully',
//       });
//       const [role] = Object.values(foundUsername?.roles);
//       const notificationId = handleCreateId(notificationDB.notifications);
//       const currentNotification = {
//         id: notificationId,
//         ...notificationFormData,
//         sender: senderLookUp[sender],
//         isRead: false,
//         isReadAsList: false,
//         role,
//       };

//       notificationDB.setNotifications([
//         ...notificationDB.notifications,
//         currentNotification,
//       ]);
//       fsPromises.writeFile(
//         path.join(__dirname, 'data', 'notifications.json'),
//         JSON.stringify(notificationDB.notifications)
//       );

//       const notifications = notificationDB.notifications;
//       const unreadNotifications = notificationDB.notifications.filter(
//         (notification) => notification.isRead === false
//       );
//       io.emit('get_notification', {
//         notifications,
//         unreadNotifications,
//       });
//     }
//   });

//   socket.on('send_is_read_notification_all', (data) => {
//     const filterNotifications = data?.map((noti) => {
//       if (!noti.isRead) {
//         return { ...noti, isRead: true };
//       }

//       return noti;
//     });

//     if (filterNotifications) {
//       notificationDB.setNotifications([...filterNotifications]);

//       fsPromises.writeFile(
//         path.join(__dirname, 'data', 'notifications.json'),
//         JSON.stringify(notificationDB.notifications)
//       );
//     }
//   });

//   socket.on('send_is_read_notification', ({ id, isRead }) => {
//     let foundNotification;

//     if (id) {
//       foundNotification = notificationDB.notifications.find(
//         (notfication) => notfication.id === id
//       );
//     } else {
//       return new Error('ID not Found');
//     }

//     foundNotification.isRead = isRead || true;

//     const remainingNotifications = notificationDB.notifications.filter(
//       (notification) => notification.id !== id
//     );

//     notificationDB.setNotifications([
//       ...remainingNotifications,
//       foundNotification,
//     ]);

//     fsPromises.writeFile(
//       path.join(__dirname, 'data', 'notifications.json'),
//       JSON.stringify(notificationDB.notifications)
//     );
//   });

//   socket.on(
//     'send_is_read_as_list_notification',
//     ({ id, isRead, isReadAsList }) => {
//       const foundNotification = notificationDB.notifications.find(
//         (notfication) => notfication.id === id
//       );

//       foundNotification.isRead = isRead || true;
//       foundNotification.isReadAsList = isReadAsList || true;

//       const remainingNotifications = notificationDB.notifications.filter(
//         (notification) => notification.id !== id
//       );

//       const sortedNotification = [
//         ...remainingNotifications,
//         foundNotification,
//       ].sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

//       notificationDB.setNotifications([...sortedNotification]);

//       fsPromises.writeFile(
//         path.join(__dirname, 'data', 'notifications.json'),
//         JSON.stringify(notificationDB.notifications)
//       );
//     }
//   );

//   socket.on('disconnect', () => {
//     console.log('\x1b[38;2;255;165;0m%s\x1b[0m', 'disconnected');
//   });
// });

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   console.log('username', username);
//   // if (!username) {
//   //   return next(new Error('invalid username'));
//   // }
//   socket.username = username;
//   next();
// });

io.on('connection', (socket) => {
  mainSocket(socket, io);
});

server.listen(PORT, () =>
  console.log('\x1b[34m%s\x1b[0m', `Server running on port ${PORT}`)
);

const path = require('path');
const fsPromises = require('fs').promises;
const handleCreateId = require('../utilities/createId');

const userDB = {
  users: require('../data/user.json'),
  setUsers(data) {
    this.users = data;
  },
};

const notificationDB = {
  notifications: require('../data/notifications.json'),
  setNotifications(data) {
    this.notifications = data;
  },
};

const socketUsersDB = {
  socketUsers: require('../data/connectedSocketUsers.json'),
  setSocketUsers(data) {
    this.socketUsers = data;
  },
};

const mainSocket = (socket, io) => {
  console.log('\x1b[35m%s\x1b[4m', 'socket connection established');

  //   const users = [];
  //   for (let [id, socket] of io.of('/').sockets) {
  //     users.push({
  //       userID: id,
  //       username: socket.username,
  //     });
  //   }

  //   io.emit('users', users);

  //   console.log('users=>', users);
  //OnDcTIZpVXkwCa1gAAAB

  socket.on('send_notification', ({ notificationFormData, sender }) => {
    const senderLookUp = { 1986: 'Admin', 2001: 'User', 2024: 'Student' };

    const username = notificationFormData?.to;

    const foundUsername = userDB.users.find(
      (person) => person.username === username
    );

    if (!foundUsername) {
      io.emit('response', {
        status: 'error',
        message: `Username ${notificationFormData?.to} is not a User`,
      });
    } else {
      io.emit('response', {
        status: 'success',
        message: 'Notification Sent Successfully',
      });

      const [role] = Object.values(foundUsername?.roles);
      const notificationId = handleCreateId(notificationDB.notifications);
      const currentNotification = {
        id: notificationId,
        ...notificationFormData,
        sender: senderLookUp[sender],
        isRead: false,
        isReadAsList: false,
        role,
      };

      notificationDB.setNotifications([
        ...notificationDB.notifications,
        currentNotification,
      ]);
      fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'notifications.json'),
        JSON.stringify(notificationDB.notifications)
      );

      const notifications = notificationDB.notifications;
      const unreadNotifications = notificationDB.notifications.filter(
        (notification) => notification.isRead === false
      );

      //   userDB.users.map((person) => {
      //     if (person.username === notificationFormData?.to) {
      //       console.log(person.username);
      //       io.emit('noti', { message: `Hi ${person.username}` });
      //     } else {
      //       console.log('no user found..');
      //       return;
      //     }
      //   });

      io.emit('noti', {
        username: notificationFormData?.to,
        message: `Hi ${notificationFormData?.to}`,
      });

      io.emit('get_notification', {
        notifications,
        unreadNotifications,
      });
    }
  });

  socket.on('send_is_read_notification_all', (data) => {
    const filterNotifications = data?.map((noti) => {
      if (!noti.isRead) {
        return { ...noti, isRead: true };
      }

      return noti;
    });

    if (filterNotifications) {
      notificationDB.setNotifications([...filterNotifications]);

      fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'notifications.json'),
        JSON.stringify(notificationDB.notifications)
      );
    }
  });

  socket.on('send_is_read_notification', ({ id, isRead }) => {
    let foundNotification;

    if (id) {
      foundNotification = notificationDB.notifications.find(
        (notfication) => notfication.id === id
      );
    } else {
      return new Error('ID not Found');
    }

    foundNotification.isRead = isRead || true;

    const remainingNotifications = notificationDB.notifications.filter(
      (notification) => notification.id !== id
    );

    notificationDB.setNotifications([
      ...remainingNotifications,
      foundNotification,
    ]);

    fsPromises.writeFile(
      path.join(__dirname, '..', 'data', 'notifications.json'),
      JSON.stringify(notificationDB.notifications)
    );
  });

  socket.on(
    'send_is_read_as_list_notification',
    ({ id, isRead, isReadAsList }) => {
      const foundNotification = notificationDB.notifications.find(
        (notfication) => notfication.id === id
      );

      foundNotification.isRead = isRead || true;
      foundNotification.isReadAsList = isReadAsList || true;

      const remainingNotifications = notificationDB.notifications.filter(
        (notification) => notification.id !== id
      );

      const sortedNotification = [
        ...remainingNotifications,
        foundNotification,
      ].sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

      notificationDB.setNotifications([...sortedNotification]);

      fsPromises.writeFile(
        path.join(__dirname, '..', 'data', 'notifications.json'),
        JSON.stringify(notificationDB.notifications)
      );
    }
  );

  socket.on('get_user_session', ({ username }) => {
    if (username) {
      io.emit('send_user_session', { username });
    }
  });

  socket.on('disconnect', () => {
    console.log('\x1b[38;2;255;165;0m%s\x1b[0m', 'socket disconnected');
  });
};

module.exports = mainSocket;

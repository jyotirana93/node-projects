const notificationDB = {
  notifications: require('../../data/notifications.json'),
  setNotifications(data) {
    this.notifications = data;
  },
};
const path = require('path');
const fsPromises = require('fs').promises;

const handleAddUnreadNotification = (req, res) => {
  const data = req.body;

  console.log('unread-notification data=>', data);

  res.send('<h1>Unread notification api</h1>');
};

module.exports = { handleAddUnreadNotification };

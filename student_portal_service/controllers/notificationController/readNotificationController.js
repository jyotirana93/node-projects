const notificationDB = {
  notifications: require('../../data/notifications.json'),
  setNotifications(data) {
    this.notifications = data;
  },
};

const handleGetNotification = (req, res) => {
  const notifications = notificationDB.notifications;
  const unreadNotifications = notificationDB.notifications.filter(
    (notification) => notification.isRead === false
  );

  res.status(200).json({ notifications, unreadNotifications });
};

module.exports = { handleGetNotification };

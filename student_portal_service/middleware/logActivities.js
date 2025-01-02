const userActivitiesDB = {
  activities: require('../data/activities.json'),
  setActivities(data) {
    this.activities = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const handleUserActivities = (req, res, next) => {
  const logActivity = async (activity) => {
    const filePath = path.join(__dirname, '..', 'data', 'activities.json');
    const newActivity = { ...activity };
    const oldActivities = userActivitiesDB.activities;

    userActivitiesDB.setActivities([...oldActivities, newActivity]);
    await fsPromises.writeFile(
      filePath,
      JSON.stringify(userActivitiesDB.activities)
    );

    try {
    } catch (error) {
      console.log(error);
    }
  };

  req.logActivity = logActivity;

  next();
};

module.exports = handleUserActivities;

const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const getImageUtils = require('../utilities/imageUtils');

const getAllUsers = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'models', 'users.json');

    const data = await fsPromises.readFile(filePath, 'utf-8');

    const parsedData = JSON.parse(data);

    res.status(200).json({ data: parsedData });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log(error.stack);
    console.log(error.name);
    console.log(error.status);
    console.log(error.code);
    res.status(500).send('Something went wrong');
  }
};

const createNewUser = async (req, res) => {
  try {
    const id = req.body.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const desgn = req.body.desgn;
    const { imageBase64URL, imageExtension } = getImageUtils(
      req.body?.userImage
    );

    const imageName = `${firstname}${id}.${imageExtension[2]}`;
    const bufferImage = Buffer.from(imageBase64URL, 'base64');

    const newUserData = {
      id,
      firstname,
      lastname,
      desgn,
      userProfileImage: `assets/images/${imageName}`,
    };

    const imageFilePath = path.join(
      __dirname,
      '..',
      'public',
      'assets',
      'images',
      imageName
    );

    const filePath = path.join(__dirname, '..', 'models', 'users.json');

    const usersList = await fsPromises.readFile(filePath, 'utf-8');
    const parsedUserList = JSON.parse(usersList);

    const updatedUsersList = [...parsedUserList, newUserData];

    await fsPromises.writeFile(imageFilePath, bufferImage);
    await fsPromises.writeFile(filePath, JSON.stringify(updatedUsersList));

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: updatedUsersList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something Went Wrong');
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { firstname, lastname, desgn, updatedUserProfileImage } = req?.body;

    const { imageBase64URL, imageExtension } = getImageUtils(
      updatedUserProfileImage
    );

    const filePath = path.join(__dirname, '..', 'models', 'users.json');
    const updatedUserData = { id: userId, firstname, lastname, desgn };
    const usersList = await fsPromises.readFile(filePath, 'utf-8');
    const parsedUserList = JSON.parse(usersList);

    const foundUser = parsedUserList.find((person) => person.id === userId);
    const imageName = `${foundUser.firstname}${foundUser.id}.${imageExtension[2]}`;
    const userProfileImage = `assets/images/${imageName}`;

    const imageFilePath = path.join(
      __dirname,
      '..',
      'public',
      'assets',
      'images',
      imageName
    );

    await fsPromises.unlink(
      path.join(__dirname, '..', 'public', foundUser.userProfileImage)
    );

    if (!fs.existsSync(imageFilePath)) {
      await fsPromises.writeFile(
        imageFilePath,
        Buffer.from(imageBase64URL, 'base64')
      );
    } else {
      await fsPromises.writeFile(
        imageFilePath,
        Buffer.from(imageBase64URL, 'base64')
      );
    }

    const updatedUsersList = parsedUserList.map((person) => {
      if (person.id === userId) {
        return { ...updatedUserData, userProfileImage };
      }
      return person;
    });

    await fsPromises.writeFile(filePath, JSON.stringify(updatedUsersList));

    res
      .status(200)
      .json({ status: 'success', message: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(__dirname, '..', 'models', 'users.json');
    const usersList = await fsPromises.readFile(filePath, 'utf-8');
    const parsedUserList = JSON.parse(usersList);

    const filteredUsersList = parsedUserList.filter(
      (person) => person.id !== parseInt(id)
    );

    const foundUser = parsedUserList.find(
      (person) => person.id === parseInt(id)
    );

    const imageFilePath = path.join(
      __dirname,
      '..',
      'public',
      foundUser.userProfileImage
    );

    await fsPromises.unlink(imageFilePath);

    await fsPromises.writeFile(
      filePath,
      JSON.stringify([...filteredUsersList])
    );

    res
      .status(200)
      .json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something Went Wrong');
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};

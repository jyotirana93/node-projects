const userPersonalInformationDB = {
  userPersonalInformation: require('../../data/userPersonalInformation.json'),
  setUserPersonalInformation(data) {
    this.userPersonalInformation = data;
  },
};

const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

const handleGetUserIdPersonalInformation = async (req, res) => {
  const { userId: id } = req.params;

  const user = userPersonalInformationDB.userPersonalInformation.find(
    (person) => person.userId === parseInt(id)
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const {
    userId,
    dateCreated,
    firstname,
    lastname,
    mobile,
    email,
    gender,
    image,
  } = user;

  const userImage = image;

  const imageExtension = path.extname(userImage).substring(1);

  let imagePath = path.join(__dirname, '..', '..', 'public', `${userImage}`);

  if (!fs.existsSync(imagePath)) {
    imagePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'images',
      'image_placeholder.png'
    );
  }

  try {
    const binaryImage = await fsPromises.readFile(imagePath);

    const base64Image = Buffer.from(binaryImage).toString('base64');

    const base64ImageUrl = `data:image/${imageExtension};base64,${base64Image}`;

    const updatedUser = {
      userId,
      dateCreated,
      email,
      firstname,
      gender,
      image: base64ImageUrl,
      lastname,
      mobile,
    };
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleGetUserIdPersonalInformation };

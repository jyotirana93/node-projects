const express = require('express');
const path = require('path');
const app = express();
const fsPromises = require('fs').promises;
const { generateRandomID } = require('./utils/randomID');

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'main.html'));
});
app.get('/add-users', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-users.html'));
});

app.get('/read-data', async (req, res) => {
  try {
    const users = await fsPromises.readFile(
      path.join(__dirname, 'data', 'users.json'),
      'utf-8'
    );
    res.status(200).json({ data: JSON.parse(users) });
  } catch (error) {
    console.log(error);
  }
});

app.post('/write-data', async (req, res) => {
  try {
    const content = {
      id: generateRandomID(),
      name: req.body.name,
      age: req.body.age,
      desg: req.body.desg,
    };

    let users = [];

    const data = await fsPromises.readFile(
      path.join(__dirname, 'data', 'users.json'),
      'utf8'
    );
    users = JSON.parse(data);
    users.push(content);

    fsPromises.writeFile(
      path.join(__dirname, 'data', 'users.json'),
      JSON.stringify(users, null, 2)
    );

    res.status(201).json({ msg: 'successfully created', data: users });
  } catch (error) {
    console.log(error);
  }
});

app.put('/update-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, desg } = req.body;

    const data = await fsPromises.readFile(
      path.join(__dirname, 'data', 'users.json'),
      'utf-8'
    );

    const updatedData = JSON.parse(data).map((user) => {
      if (user.id === id) {
        return { ...user, name, age, desg };
      }
      return user;
    });

    await fsPromises.writeFile(
      path.join(__dirname, 'data', 'users.json'),
      JSON.stringify(updatedData)
    );

    res.status(201).json({ msg: 'Updated successfully', data: updatedData });
  } catch (error) {
    console.log(error);
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await fsPromises.readFile(
      path.join(__dirname, 'data', 'users.json'),
      'utf8'
    );

    const remainingData = JSON.parse(data).filter((user) => user.id !== id);

    await fsPromises.writeFile(
      path.join(__dirname, 'data', 'users.json'),
      JSON.stringify(remainingData)
    );

    res
      .status(200)
      .json({ msg: 'user deleted successfully', data: remainingData });
  } catch (error) {
    console.log(error);
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'pageNotFound.html'));
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

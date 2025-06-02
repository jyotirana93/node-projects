const express = require('express');
const path = require('path');
const fsPromises = require('fs').promises;
const cors = require('cors');
const app = express();
const corsOptions = require('./config/corsOptions');

PORT = 3500 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', require('./routes/pages'));
app.use('/api/users', require('./routes/api/users'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const express = require('express');
const app = express();
const path = require('path');

// app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(`
    <div style='display:flex;flex-direction:column;align-items:center;'>
    <h1>Welcome to express API</h1>
    <img style='margin-left:9rem;' src='/static/images/express.jpg' alt='express image'/>
    </div>
    `);
});

app.use((req, res) => {
  res.status(404).send(
    `<h1 style=' display: flex;
  justify-content: center; 
  align-items: center;    
  margin-top:9rem;'>The requested url was not found on this express server</h1>`
  );
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server running on port ${3500}`));

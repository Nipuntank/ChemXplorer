const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const compoundsRouter = require('./routes/compounds.routes');
app.use('/api/compounds', compoundsRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Chemical Compounds API' });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
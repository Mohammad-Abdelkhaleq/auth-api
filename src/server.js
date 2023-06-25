'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const v1Routes = require('./routes/v1.js');
const authRoutes = require('./routes/routes.js');
const v2Routes = require('./routes/V2.js');

const app = express();

//home route

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(logger);

// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

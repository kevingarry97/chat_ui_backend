const express = require('express');
const parser = require('body-parser');
const db = require('./db/db');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chats');
const config = require('config');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

if (!config.get("jwtPrivatekey"))
  throw new Error('FATAL ERROR: jwt key is not defined');

app.use(cors({ origin: '*', credentials: true }));
app.use(parser.json({ limit: "50mb" }));
app.use(parser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(compression());
app.use(helmet());

app.use('/api', userRoutes);
app.use('/api', chatRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to Port ${port} successfully`));

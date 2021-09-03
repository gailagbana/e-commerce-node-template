/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 **/

/** environment config */
require('dotenv').config();

/** 3rd Party Middlewares */
let express = require('express');
let compression = require('compression');
let cors = require('cors');
let helmet = require('helmet');

let { morgan } = require('./src/utilities/logger');
let { loadEventSystem } = require('./src/events/_loader');
let { connect, loadModels } = require('./src/models/_config');

const { APP_PORT } = process.env;

/** App Initialisation */
let app = express();

/** Database Conneciton Setup */
connect();
loadModels();
loadEventSystem();

/** Middleware Applications */
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan);

/** Route Middleware */
app.use('/', require('./src/routes/_config'));

/** */
app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
});

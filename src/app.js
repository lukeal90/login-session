const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const logger = require('./helpers/logger');
const Router = require('./routes');
const packageJson = require('../package.json');
const InstanceManagementService = require('./helpers/dbManagement/InstanceManagementService');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const {
    BODY_LIMIT,
    NODE_ENV,
    PORT,
    DB,
    MONGO_URL
} = process.env;
const DbManager = new InstanceManagementService().build(DB);
class App {
    constructor() {
        this.dbManagement = DbManager;
        this.app = express();
    }

    _onListening() {
        logger.info(`Started ${packageJson.name} at port ${PORT} in ${NODE_ENV} environment`);
    }

    _onError(err) {
        logger.error(`App Crashed, Error: ${err.errorMessage}`);
        process.exit;
    }

    _configure() {
        this._middleWares();
        return this._routes();
    }

    _middleWares() {
        this.app.use(bodyParser.json({limit: BODY_LIMIT}));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static(path.resolve('public')));
        this.app.use(cookieParser());
        this.app.use(morgan('dev'));
        this.app.use(cors({
            credentials: true,
            origin: /^http:\/\/localhost/
        }));

        this.app.use(
            session({
              store: MongoStore.create({
                mongoUrl: MONGO_URL,
                mongoOptions: {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
                },
              }),
              key: "user_sid",
              secret: "c0d3rH0us3",
              resave: true,
              saveUninitialized: true,
              cookie: { maxAge: 60000 },
            })
          );
        return;
    }

    async _routes() {
        Router.configure(this.app);
        return;
    }

    async init() {
        await this._configure();
        this.app.listen(PORT, this._onListening);
        this.app.on('error', this._onError);
        return this.app;
    }    
}

module.exports = App;
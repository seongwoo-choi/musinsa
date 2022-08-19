const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use((error, req, res, next)=> {
    const status = error.statusCode || 500;
    const msg = error.message;
    const data = error.data;

    res.status(status).json({ status, data, msg });
});

const start = () => {
    try {
        app.listen(process.env.PORT || 8080);
    } catch (err) {
        console.log(err);
    }
}

start();
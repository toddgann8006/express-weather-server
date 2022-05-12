import createError from 'http-errors';
import express from 'express';
import bodyParser from "body-parser"
import fetch from 'node-fetch';
import 'dotenv/config';
import cors from 'cors';
const router = express.Router();
const app = express();

import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from "./routes/index.js";

const apiKey = `${process.env.API_KEY}`;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

router.get('/', function (req, res) {
  res.render("index", { weather: null, error: null });
});

router.post('/', function (req, res, next) {
  let zip = req.body.zip;
  let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},US&units=metric&appid=${apiKey}`;
  console.log(`This is the zip ${zip}`)
  fetch(url)
    .then(res => res.json())
    .then(data => {
      res.send({ data });
    })
    .catch(err => {
      res.redirect('/error');
    });
})

app.use('/', router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

export default app;
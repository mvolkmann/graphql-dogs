const USE_HTTPS = false;
const PORT = 1919;

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
const PgConnection = require('postgresql-easy');

const dbConfig = {database: 'dogs'};
const pg = new PgConnection(dbConfig);

const app = express();

// Configure Cross-Origin Resource Sharing (CORS).
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  //credentials: true,
  // origin(origin, cb) {
  //   console.log('server.js origin: origin =', origin);
  //   cb(null, whitelist.includes(origin));
  // }
};
app.use(cors(corsOptions));

app.use(morgan('short'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.text());

function handleError(res, action, error) {
  const msg = error ? `failed to ${action}: ${error.message}` : action;
  console.error(msg);
  res.status(500).send(msg);
}

app.get('/heartbeat', async (req, res) => {
  res.send('I am alive!');
});

app.delete('/dogs/:id', async (req, res) => {
  const {id} = req.params;
  try {
    pg.query(`delete from dog where id = ${id}`);
    res.sendStatus(200);
  } catch (e) {
    res.send(e.message).status(500);
  }
});

app.get('/dogs', async (req, res) => {
  try {
    const dogs = await pg.query('select * from dog');
    res.set('Content-Type', 'application/json');
    res.send(dogs);
  } catch (e) {
    handleError(res, `get dogs`, e);
  }
});

app.post('/dogs', async (req, res) => {
  const dog = req.body;
  let {id} = dog;

  try {
    if (id === undefined) {
      id = await pg.insert('dog', dog);
    } else {
      pg.updateById('dog', id, dog);
    }
    res.send(String(id));
  } catch (e) {
    handleError(res, 'insert/update dog', e);
  }
});

app.delete('/people/:id', async (req, res) => {
  const {id} = req.params;
  try {
    pg.query(`delete from person where id = ${id}`);
    res.sendStatus(200);
  } catch (e) {
    res.send(e.message).status(500);
  }
});

app.get('/people', async (req, res) => {
  try {
    const people = await pg.query('select * from person');
    res.set('Content-Type', 'application/json');
    res.send(people);
  } catch (e) {
    handleError(res, `get people`, e);
  }
});

app.post('/people', async (req, res) => {
  const person = req.body;
  let {id} = person;

  try {
    if (id === undefined) {
      id = await pg.insert('person', person);
    } else {
      pg.updateById('person', id, person);
    }
    res.send(String(id));
  } catch (e) {
    handleError(res, 'insert/update person', e);
  }
});

if (USE_HTTPS) {
  const options = {
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
  };
  const server = https.createServer(options, app);
  server.listen(PORT, () => console.info('ready'));

  server.keepAliveTimeout = 600 * 1000;
} else {
  // HTTP
  app.listen(PORT, () => console.info('ready'));
}

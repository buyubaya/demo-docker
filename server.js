/*
 * Manage Session in Node.js and ExpressJS
 * Author : Shahid Shaikh
 * Version : 0.0.2
*/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client = redis.createClient();
const router = express.Router();
const app = express();

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    // store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '/views'));

// router.get('/', (req, res) => {
//     let sess = req.session;
//     console.log('GET /', req.session);
//     if (sess.email) {
//         return res.redirect('/admin');
//     }
//     res.sendFile('index.html');
// });

function doWork(x){
    const start = Date.now();
    while(Date.now() - start < x){}
}

router.get('/', (req, res) => {
    doWork(3000);
    res.send('INDEX');
    // setTimeout(() => {
        
    // }, 3000);
});
router.get('/fast', (req, res) => {
    res.send('FAST');
});

router.post('/login', (req, res, next) => {
    console.log('POST LOGIN', req.session, req.body);
    if(!req.session){
        req.session = {};
    }
    req.session.email = req.body.email;
    console.log('POST LOGIN END', req.session, req.body);
    res.end('done');
});

router.get('/admin', (req, res) => {
    console.log('GET ADMIN', req.session);
    if (req.session && req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href=' + '/logout' + '>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href=' + '/' + '>Login</a>');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
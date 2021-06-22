const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.use(express.static('html'))

router.get('/', function (req, res) {

});

router.post('/index.html', function (req, res) {
    res.redirect('/index.html');
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');
require('universal-dotenv');

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const listid = process.env.LISTID;
const key = process.env.KEY;
const port = process.env.PORT || 8000;

function onData(onResponse, err, req, body) {
    // console.log(err)
    // console.log(body)
    if(err) {
        onResponse('unable to connect to internal MC service');
        // err.toString()
    }
    else if(body && body.title && body.status > 299) {
        onResponse(body.title)
    }
    else {
        onResponse(null);
    }
}
function mailChimpSend(email, onResponse) {
    const data = {
        json: {
            "email_address": email,
            "status": "subscribed"
        }
    };
    request.post(
            'https://us16.api.mailchimp.com/3.0/lists/' +
            listid + '/members/', data,
            onData.bind(null, onResponse))
        .auth('anyusername', key)
        /* .on('response', function(response) {
            console.log('re', response.statusCode, response.statusMessage)
        })
        .on('error', function(err) {
            console.log(err)
        })*/
}

app.get('/', (req, res, next) => {
    res.send('no GET access');
})

app.get('/hello', (req, res, next) => {
    res.send(`ok`)
})

app.post('/', bodyParser.json(), (req, res, next) => {
    if (!req.body || !req.body.email) {
        // res.status(400).send('no email given');
        res.json({err:'no email given'})
        return;
    }
    console.log('POST', req.body);
    mailChimpSend(req.body.email, (err) => {
        if(!err) res.json({status:'ok'})
        else res.json({err:err})
        //res.status(400).send(err);
    })
});

app.listen(port, () => {
    console.log(`Live on port: ${port}!`);
});
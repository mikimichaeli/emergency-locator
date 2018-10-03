const express = require('express')
const app = express()
const port = 3000

var session = null;
count = 0;

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

app.post('/api/incident', (req, res) => {

    session = guid();
    count = 0;

    res.send({id: session });

})

app.get('/api/incident/:uuid', (req, res) => {

    let uuid = req.params.uuid;

    count++;

    if (count > 5) {
        res.send({
            status: 'location_approved',
            location: {
                "longitude": 34.855499, "latitude": 32.109333
            }
        });
        count = 0;
    } else {
        res.send({status: 'location_waiting' });
    }

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const debug = process.env.NODE_ENV !== 'production';
const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// Adding static folder
app.use(express.static(path.join(__dirname, 'public')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'public', 'index.html')));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Listening to the port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} or http://127.0.0.1:${port}`);
});
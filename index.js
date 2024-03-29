const express = require('express');
const app = express();
const { dbConnection } = require('./database/config');

const path = require('path');
const logger = require("morgan");
const PORT = process.env.PORT || 4000;

//CORS
const cors = require('cors');
//DOTENV
require('dotenv').config();


app.use(logger("dev"));

//read and parse body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

//database
dbConnection();

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//to deploy react app whith nodejs in heroku
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "./frontend/build")));

//to deploy react app whith nodejs in heroku
// app.get('*', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });
app.get("*", (res) => {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
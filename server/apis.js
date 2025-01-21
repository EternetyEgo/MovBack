const express = require("express");

let apis = (app) => {
    app.use(express.json());
    app.use(express.static('public'))

    app.use('/api/movie', require('../routers/Movie'));
    app.use('/api/user', require('../routers/User'));
};

module.exports = apis;
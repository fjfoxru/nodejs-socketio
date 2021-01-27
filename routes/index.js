const express = require('express');
const router = express.Router();

router.get('/', (request, responce) => {
    responce.render('index', {
        title: "Главная"
    });
});

module.exports = router;
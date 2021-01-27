const express = require('express');
const router = express.Router();
const {Book} = require('../models');

const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

router.get('/', async (request, responce) => {
    const books = await Book.find();
    responce.render("books/index", {
        title: "Книги",
        books: books
    });
});

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Создание книги",
        book: {
            title: '',
            description: '',
        },
    });
});

router.post('/create', async (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const newBook = new Book({
        title: title,
        description: description,
    });
    try {
        await newBook.save();
        res.redirect('/books');
    } catch (e) {
        console.error(e);
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    let book;
    try {
        book = await Book.findById(id);
        if (!book) {
            res.status(404).redirect('/404');
        }
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }
    res.render("books/view", {
        title: "Просмотр книги",
        book: book,
    });

    io.on('connection', (socket) => {
        const {id} = socket;
        console.log(`Socket connected: ${id}`);
    
        // сообщение себе
        socket.on('message-to-me', (msg) => {
            msg.type = 'me';
            socket.emit('message-to-me', msg);
        });
    
        // сообщение для всех
        socket.on('message-to-all', (msg) => {
            msg.type = 'all';
            socket.broadcast.emit('message-to-all', msg);
            socket.emit('message-to-all', msg);
        });
    
        // работа с комнатами
        const {roomName} = socket.handshake.query;
        console.log(`Socket roomName: ${roomName}`);
        socket.join(roomName);
        socket.on('message-to-room', (msg) => {
            msg.type = `room: ${roomName}`;
            socket.to(roomName).emit('message-to-room', msg);
            socket.emit('message-to-room', msg);
        });
    
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${id}`);
        });
    });
});

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    let book;
    try {
        book = await Book.findById(id);
        if (!book) {
            res.status(404).redirect('/404');
        }
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }
    res.render("books/update", {
        title: "Обновление книги",
        book: book,
    });
});

router.post('/update/:id', async (req, res) => {
    const {id} = req.params;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    try {
        await Book.findByIdAndUpdate(id, {title: title, description: description});
        res.redirect(`/books/${id}`);
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
});

router.post('/delete/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await Book.deleteOne({_id: id});
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }
    res.redirect(`/books`);
});

module.exports = router;
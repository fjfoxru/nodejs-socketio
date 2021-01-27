const express = require('express');
const router = express.Router();
const {Book} = require('../../models');


router.get('/', async (req, res) => {
    const books = await Book.find().select('-__v');
    res.json(books);
});


router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id).select('-__v');
        res.json(book);
    } catch (e) {
        console.error(e);
        res.status(404).json("Нет такой книги");
    }
});

router.post('/', async (req, res) => {
    const {title, description} = req.body;

    const newBook = new Book({
        title: 'title...',
        desc: 'desc...',
    });

    try {
        await newBook.save();
        res.json(newBook);
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {title, description} = req.body;

    try {
        await Book.findByIdAndUpdate(id, {title: '22', description: '333'});
        res.redirect(`/api/books/${id}`);
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        await Book.deleteOne({_id: id});
        res.json('ok');
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
});

module.exports = router;
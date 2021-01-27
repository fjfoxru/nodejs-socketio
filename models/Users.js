const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    
});

module.exports = model('Book', bookSchema);
const mongoose = require('mongoose');

const {
    Schema
} = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },    
}, {
    collection: 'users',
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', UserSchema);
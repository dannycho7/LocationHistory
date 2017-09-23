var mongoose = require('mongoose');

var User = mongoose.model('User', { email: String });

module.exports = User;
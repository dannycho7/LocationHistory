var mongoose = require('mongoose');

var User = mongoose.model('User', { email: String, routes: Array });

module.exports = User;
'use strict';

var UserModel = require('../models/User');
var UserManager = require('../managers/UserManager');

var HTTPStatus = require('http-status');

var UserController = function () {

};

UserController.prototype.createUser = function (req, res) {
    if (!req.body.email) return res.status(HTTPStatus.BAD_REQUEST).json({status : HTTPStatus.BAD_REQUEST, message: 'Email is required for create a user'});
    if (!req.body.password) return res.status(HTTPStatus.BAD_REQUEST).json({status : HTTPStatus.BAD_REQUEST, message: 'Password is required for create a user'});

    var user = req.body;
    var frenchUtcOffset = 0;
    var result = UserModel.validatePost(user);

    user.createdAt = moment().utcOffset(frenchUtcOffset).format('DD-MM-YYYY HH:mm:ss');

    if (false === result.status) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
            status: HTTPStatus.BAD_REQUEST,
            message: result.message
        })
    }

    var response = UserManager.createUser(user);

    if (false === response.status) return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        message: response.message
    });

    return res.status(HTTPStatus.OK).json({
        status: HTTPStatus.OK,
        message: 'News Created',
        id: response.newsId
    });
};

UserController.prototype.updateUser = function (req, res) {
    if (!req.body.uid) return res.status(HTTPStatus.BAD_REQUEST).json({status : HTTPStatus.BAD_REQUEST, message: 'Uid is required for update a user'});

    var user = req.body;

    var frenchUtcOffset = 0;

    var result = UserModel.validatePut(user);

};

UserController.prototype.getUser = function(req, res) {

};

UserController.prototype.deleteUser = function(req, res) {

};

module.exports = new UserController();

'use strict';

var AuthManager = require('../managers/AuthManager');
var UserManager = require('../managers/UserManager');

var HTTPStatus = require('http-status');

var AuthController = function () {
};

AuthController.prototype.register = function (req, res) {
    console.log(req.body);
    if (!req.body.email) return res.status(HTTPStatus.BAD_REQUEST).json({status : HTTPStatus.BAD_REQUEST, message: 'Email is required for register'});
    if (!req.body.password) return res.status(HTTPStatus.BAD_REQUEST).json({status : HTTPStatus.BAD_REQUEST, message: 'Password is required for register'});

    AuthManager.register(req.body)
        .then(function(response) {
            var result = UserManager.createUser(response.authInfo);

            if (!result.status) return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({status : HTTPStatus.INTERNAL_SERVER_ERROR, message: result.message});

            return res.status(HTTPStatus.OK).json(result);
        }, function(err){
            if (err)
                switch(err) {
                    case HTTPStatus[403]:
                        return res.status(HTTPStatus.FORBIDDEN).json({status : HTTPStatus.FORBIDDEN, message: 'Email already taken'});
                        break;
                    case HTTPStatus[400]:
                        return res.status(HTTPStatus.BAD_REQUEST).json({status : HTTPStatus.BAD_REQUEST, message: 'Invalid email'});
                        break;
                    case HTTPStatus[500]:
                        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({status : HTTPStatus.INTERNAL_SERVER_ERROR, message: 'An Error Occured'});
                        break;
                }
        });
};

AuthController.prototype.login = function(req, res) {

};

AuthController.prototype.logout = function(req, res) {

};

AuthController.prototype.changePassword = function (req, res) {

};

AuthController.prototype.lostPassword = function (req, res) {

};

module.exports = new AuthController();

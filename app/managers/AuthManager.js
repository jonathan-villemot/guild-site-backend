'use strict';

var Firebase = require('firebase'),
    properties = require('../../config/properties_' + (process.env.NODE_ENV || 'dev')),
    Q = require('q'),
    HTTPStatus = require('http-status'),
    _ = require('lodash'),
    dbRef = new Firebase(properties.firebase.dbRef);

var AuthManager = function () {
};

AuthManager.prototype.register = function(authInfo) {
    var deferred = Q.defer();

    dbRef.createUser({
        email: authInfo.email,
        password: authInfo.password
    }, function(err, userData) {
        if (err) {
            if ('EMAIL_TAKEN' === err.code) return deferred.reject(HTTPStatus[403]);
            if ('INVALID_EMAIL' === err.code) return deferred.reject(HTTPStatus[400]);

            return deferred.reject(HTTPStatus[500]);
        } else {
            authInfo.uid = userData.uid;

            return deferred.resolve({status: true, message: 'Registration successful', authInfo : authInfo});
        }
    });

    return deferred.promise;
};

module.exports = new AuthManager();

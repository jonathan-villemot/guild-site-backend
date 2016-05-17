'use strict';

var Firebase = require('firebase'),
    properties = require('../../config/properties_' + (process.env.NODE_ENV || 'dev')),
    Q = require('q'),
    _ = require('lodash'),
    userRef = new Firebase(properties.firebase.userRef);


var UserManager = function () {
};

UserManager.prototype.createUser = function(user) {
    var newUserRef = userRef;
    
    newUserRef.set(user);

    var userId = newUserRef.key();

    if (!userId) return {status: false, message: 'could not create user in firebase'};

    return {status: true, user: user};
};

UserManager.prototype.updateUser = function(user) {
    var deferred = Q.defer();

    var updateUserRef = userRef.child(user.uid);

    updateUserRef.update(user, function (err) {
        if (err) return deferred.reject(err);

        return deferred.resolve({status: true, message: 'Update success'});
    });

    return deferred.promise;
};
module.exports = new UserManager();

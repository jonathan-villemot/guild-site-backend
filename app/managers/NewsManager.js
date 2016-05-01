'use strict';

var Firebase = require('firebase'),
    properties = require('../../config/properties_' + (process.env.NODE_ENV || 'dev')),
    Q = require('q'),
    _ = require('lodash'),
    newsRef = new Firebase(properties.firebase.newsRef);

var NewsManager = function () {
};

NewsManager.prototype.addNews = function (news) {

    var newNewsRef = newsRef.push();

    newNewsRef.set(news);

    var newsId = newNewsRef.key();

    if (!newsId) return {status: false, message: 'could not create news in firebase'};

    return {status: true, newsId: newsId};
};

NewsManager.prototype.updateNews = function (news, id) {
    var deferred = Q.defer();

    var updateNewsRef = newsRef.child(id);

    updateNewsRef.update(news, function (err) {
        if (err) return deferred.reject(err);

        return deferred.resolve({status: true, message: 'Update success'});
    });

    return deferred.promise;
};

NewsManager.prototype.getNewsById = function (newsId) {
    var deferred = Q.defer();

    newsRef.child(newsId).on('value', function (news) {
        if (_.isNull(news.val())) return deferred.reject('no news found for id ' + newsId);
        var newsToSend = news.val();
        newsToSend.id = newsId;

        return deferred.resolve({news: newsToSend});
    });

    return deferred.promise;
};

NewsManager.prototype.getAllNews = function () {
    var deferred = Q.defer();

    newsRef.orderByChild('createdAt').on('value', function (newsList) {
        if (_.isNull(newsList.val())) return deferred.reject('no news found');

        return deferred.resolve({news: newsList.val()})

    });

    return deferred.promise;
};

NewsManager.prototype.getNewsWithOffset = function (offset) {
    var deferred = Q.defer();

    newsRef.orderByChild('createdAt').limitToLast(parseInt(offset, 10)).on('value', function (newsList) {
        if (_.isNull(newsList.val())) return deferred.reject('no news found');

        return deferred.resolve({news: newsList.val()})

    });

    return deferred.promise;
};

NewsManager.prototype.deleteNews = function (newsId) {
    var deferred = Q.defer();

    var newsToDeleteRef = newsRef.child(newsId);

    var callback = function (err) {
        if (err) return deferred.reject('Could not delete news with id ' + newsId);

        deferred.resolve({message : 'News Deleted', id : newsId});
    };

    newsToDeleteRef.remove(callback);

    return deferred.promise;
};

module.exports = new NewsManager();

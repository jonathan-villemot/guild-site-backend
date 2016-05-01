'use strict';

var NewsModel = require('../models/News');
var NewsManager = require('../managers/NewsManager');

var moment = require('moment'),
    HTTPStatus = require('http-status'),
    logger = require('log4js').getLogger();

var NewsController = function () {
};

NewsController.prototype.createNews = function (req, res) {
    var news = req.body;
    var frenchUtcOffset = 0;
    var result = NewsModel.validatePost(news);

    news.createdAt = moment().utcOffset(frenchUtcOffset).format('DD-MM-YYYY HH:mm:ss');

    if (false === result.status) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
            status: HTTPStatus.BAD_REQUEST,
            message: result.message
        })
    }

    var response = NewsManager.addNews(news);

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

NewsController.prototype.updateNews = function (req, res) {
    if (!req.body.id) return res.status(HTTPStatus.BAD_REQUEST).json({
        status: HTTPStatus.BAD_REQUEST,
        message: 'id is required in the request body'
    });

    var news = req.body;
    var newsId = news.id;

    delete news['id'];

    var frenchUtcOffset = 0;
    var result = NewsModel.validatePut(news);

    news.updatedAt = moment().utcOffset(frenchUtcOffset).format('DD-MM-YYYY HH:mm:ss');

    if (false === result.status) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
            status: HTTPStatus.BAD_REQUEST,
            message: result.message
        });
    }

    NewsManager.updateNews(news, newsId)
        .then(function (response) {

            return res.status(HTTPStatus.OK).json({
                status: HTTPStatus.OK,
                message: 'News Updated',
                id: response.newsId
            });
        }, function (err) {
            logger.error(err);
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: 'Could not update news'
            });
        });
};

NewsController.prototype.getNews = function (req, res) {
    if (!req.params.id) return res.status(HTTPStatus.BAD_REQUEST).json({
        status: HTTPStatus.BAD_REQUEST,
        message: 'id is required in query parameters'
    });

    NewsManager.getNewsById(req.params.id)
        .then(function (response) {

            return res.status(HTTPStatus.OK).json({
                status: HTTPStatus.OK,
                news: response.news
            })

        }, function (err) {
            logger.error(err);
            return res.status(HTTPStatus.NOT_FOUND).json({
                status: HTTPStatus.NOT_FOUND,
                message: err
            })
        });
};

NewsController.prototype.getAllNews = function (req, res) {

    if (req.query.offset) {
        NewsManager.getNewsWithOffset(req.query.offset)
            .then(function (response) {
                return res.status(HTTPStatus.OK).json({
                    status: HTTPStatus.OK,
                    news: response.news
                });
            }, function (err) {
                logger.error(err);

                return res.status(HTTPStatus.NOT_FOUND).json({
                    status: HTTPStatus.NOT_FOUND,
                    message: err
                });
            });
    } else {
        NewsManager.getAllNews()
            .then(function (response) {
                return res.status(HTTPStatus.OK).json({
                    status: HTTPStatus.OK,
                    news: response.news
                });
            }, function (err) {
                logger.error(err);

                return res.status(HTTPStatus.NOT_FOUND).json({
                    status: HTTPStatus.NOT_FOUND,
                    message: err
                });
            });
    }
};

NewsController.prototype.deleteNews = function (req, res) {
    if (!req.params.id) return res.status(HTTPStatus.BAD_REQUEST).json({
        status: HTTPStatus.BAD_REQUEST,
        message: 'id is required in query parameters'
    });

    NewsManager.deleteNews(req.params.id)
        .then(function (response) {

            return res.status(HTTPStatus.OK).json({
                status: HTTPStatus.OK,
                message: response.message,
                id: response.id
            });
        }, function (err) {
            logger.error(err);

            return res.status(HTTPStatus.NOT_FOUND).json({
                status: HTTPStatus.NOT_FOUND,
                message: err
            });
        });
};


module.exports = new NewsController();

'use strict';

var NewsController = require('./controllers/NewsController');
var AuthController = require('./controllers/AuthController');
var UserController = require('./controllers/UserController');

module.exports.setup = function (app) {

    app
        .get('/check/', function (req, res) {
            res.status(200).json({
                message: 'welcome to the api!'
            });
        })
        /** auth routes **/
        .post('/api/login', AuthController.login)
        .post('/api/register', AuthController.register)
        .post('/api/logout', AuthController.logout)
        .post('/api/lost-password', AuthController.lostPassword)
        .post('/api/change-password', AuthController.lostPassword)

        /** user routes **/
        .post('/api/users', UserController.createUser)
        .put('/api/users', UserController.updateUser)
        .get('/api/users/:id', UserController.getUser)
        .delete('/api/users', UserController.deleteUser)

        /** news routes **/
        .post('/api/news', NewsController.createNews)
        .get('/api/news', NewsController.getAllNews)
        .get('/api/news/:id', NewsController.getNews)
        .put('/api/news', NewsController.updateNews)
        .delete('/api/news/:id', NewsController.deleteNews)
    ;

    return app;
};

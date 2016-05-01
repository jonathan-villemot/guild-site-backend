'use strict';

var NewsController = require('./controllers/NewsController');

module.exports.setup = function (app) {

    app
        .get('/check/', function (req, res) {
            res.status(200).json({
                message: 'welcome to the api!'
            });
        })
            
    /** news routes **/
        .post('/api/news', NewsController.createNews)
        .get('/api/news', NewsController.getAllNews)
        .get('/api/news/:id', NewsController.getNews)
        .put('/api/news', NewsController.updateNews)
        .delete('/api/news/:id', NewsController.deleteNews)
    ;

    return app;
};

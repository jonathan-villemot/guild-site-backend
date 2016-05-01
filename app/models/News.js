'use strict';

var chai = require('chai'),
    log4js = require('log4js'),
    logger = log4js.getLogger();

chai.use(require('chai-json-schema'));

var News = function () {
};

News.prototype.validatePost = function (news) {
    try {
        chai.expect(news).to.be.jsonSchema(schemaPost);

        return {status: true};
    } catch (error) {
        logger.error('Schema Validation Failed', error);

        return {status: false, message: error};
    }
};

News.prototype.validatePut = function (news) {
    try {
        chai.expect(news).to.be.jsonSchema(schemaPut);

        return {status: true};
    } catch (error) {
        logger.error('Schema Validation Failed', error);

        return {status: false, message: error};
    }
};

var schemaPost = {
    title: 'News valid schema',
    type: 'object',
    additionalProperties: false,
    properties: {
        title: {
            type: 'string'
        },
        message: {
            type: 'string'
        },
        pictureUrl: {
            type: 'string'
        },
        postedBy: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        }
    }
};

var schemaPut = {
    title: 'News valid schema',
    type: 'object',
    additionalProperties: false,
    properties: {
        title: {
            type: ['string', null]
        },
        message: {
            type: ['string', null]
        },
        pictureUrl: {
            type: ['string', null]
        },
        postedBy: {
            type: ['string', null]
        },
        updatedAt: {
            type: 'string'
        }
    }
};
module.exports = new News();

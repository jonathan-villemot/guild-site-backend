'use strict';

var chai = require('chai'),
    log4js = require('log4js'),
    logger = log4js.getLogger();

chai.use(require('chai-json-schema'));

var User = function () {
};

User.prototype.validatePost = function (user) {
    try {
        chai.expect(user).to.be.jsonSchema(schemaPost);

        return {status: true};
    } catch (error) {
        logger.error('Schema Validation Failed', error);

        return {status: false, message: error};
    }
};

User.prototype.validatePut = function (user) {
    try {
        chai.expect(user).to.be.jsonSchema(schemaPut);

        return {status: true};
    } catch (error) {
        logger.error('Schema Validation Failed', error);

        return {status: false, message: error};
    }
};

var schemaPost = {
    title: 'User valid schema',
    type: 'object',
    additionalProperties: false,
    properties: {
        uid: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        }
    }
};

var schemaPut = {
    title: 'User valid schema',
    type: 'object',
    additionalProperties: false,
    properties: {
        email: {
            type: 'string'
        },
        uid: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        updatedAt: {
            type: 'string'
        }
    }
};

module.exports = new User();

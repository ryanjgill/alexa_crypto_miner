'use strict';

const Alexa = require('alexa-sdk')
  , bst = require('bespoken-tools')
  , config = require('./config.js')
  , handlers = require('./handlers.js')
  , APP_ID = config.APP_ID
  , BST_ID = config.BST_ID
  , SKILL_NAME = 'Crypto Miner Monitor'
  ;

exports.handler = bst.Logless.capture(BST_ID, function (event, context) {
  let alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
});
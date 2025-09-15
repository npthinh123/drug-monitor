const express = require('express');// As in the server.js
const route = express.Router(); //Allows us use express router in this file
const services = require('../services/render');//uses the render.js file from services here
const validateDrugInput  = require('../middleware/validation');
const controller = require('../controller/controller');//uses the render.js file from services here
const errorHandler = require('../middleware/errorHandler');

route.get('/', services.home);

route.get('/manage', services.manage);
route.get('/dosage', services.dosage);
route.get('/purchase', services.purchase);
route.get('/add-drug', services.addDrug);
route.get('/update-drug', services.updateDrug);



// API for CRUD operations
// route.post('/api/drugs', controller.create);
route.get('/api/drugs', controller.find);
// route.put('/api/drugs/:id', controller.update);
route.delete('/api/drugs/:id', controller.delete);
route.post('/api/drugs', validateDrugInput, controller.create);
route.put('/api/drugs/:id', validateDrugInput, controller.update);

route.use(errorHandler);

module.exports = route;//exports this so it can always be used elsewhere
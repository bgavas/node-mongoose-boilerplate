const fs = require('fs');
const path = require('path');

var routes = {};
var basename  = path.basename(__filename);

// Read each route
fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		routes[file.substring(0, file.length - 3)] = require('./' + file);
	});

module.exports = routes;

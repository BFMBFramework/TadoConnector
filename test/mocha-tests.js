var TadoConnector = require('../dist/connector').TadoConnector;

console.log("Creating connector...")
let connector = new TadoConnector();

describe('Tado unit tests', function() {
	it('It adds a valid connection', function(done) {
		connector.addConnection({username: "", password: ""}, function(err, result) {
			if (err) {
				done(err);
			} else {
				console.log(result);
				done();
			}
		});
	})
});
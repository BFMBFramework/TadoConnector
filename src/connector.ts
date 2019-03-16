import {Connector, Connection} from "bfmb-base-connector";
import * as TadoClient from "node-tado-client";

export class TadoConnector extends Connector {
	private homeIdRequiredMethods: string[] = [
	"getHome", "getWeather", "getDevices", "getInstallations",
	"getUsers", "getState", "getMobileDevices", "getMobileDevice",
	"getMobileDeviceSettings", "getZones", "getZoneState",
	"getZoneCapabilities","getZoneOverlay", "getTimeTables",
	"getAwayConfiguration", "getTimeTable", "clearZoneOverlay",
	"setZoneOverlay"
	];

	private deviceIdRequiredMethods: string[] = [
	"getMobileDevice", "getMobileDeviceSettings"
	];

	private zoneIdRequiredMethods: string[] = [
	"getZoneState", "getZoneCapabilities","getZoneOverlay",
	"getTimeTables", "getAwayConfiguration", "getTimeTable",
	"clearZoneOverlay"
	];

	private timetableIdRequiredMethods: string[] = ["getTimeTable"];

	private powerTempRequiredMethods: string[] = ["setZoneOverlay"];

	constructor() {
		super("Tado");
	}

	addConnection(options: any, callback: Function): void {
		const self = this;
		const connection: TadoConnection = new TadoConnection(options);

		connection.getClient()
		.login(connection.getUsername(), connection.getPassword())
		.then(function(response: any) {
			self.connections.push(connection);
			callback(null, connection.getId());
		})
		.catch(function(err: Error) {
			callback(err);
		});
	}

	getMe(id: string, options: any = {}, callback: Function): void {
		const self = this;
		const connection: TadoConnection = <TadoConnection> self.getConnection(id);
		if (connection) {
			connection.getClient().getMe().then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			});
		}
	}

	receiveMessage(id: string, options: any = {}, callback: Function): void {
		const self = this;
		const connection: TadoConnection = <TadoConnection> self.getConnection(id);
		const optionsError: Error = self.verifyReceiveMessageBaseOptions(options);
		if (connection && !optionsError) {
			self.callHttpApiGetMethod(connection, options, callback);
		} else if (!connection) {
			callback(new Error("No connection on list with id: " + id));
		} else {
			callback(optionsError);
		}
	}

	private verifyReceiveMessageBaseOptions(options: any): Error {
		const self = this;
		let error: Error
		if (!options.api_method) {
			error = new Error("Parameter api_method is required in Tado connector.");
		} else if(self.homeIdRequiredMethods.indexOf(options.api_method) > -1 && !options.home_id) {
			error = new Error("Parameter home_id is required for the method requested.");
		} else if(self.deviceIdRequiredMethods.indexOf(options.api_method) > -1 && !options.device_id) {
			error = new Error("Parameter device_id is required for the method requested.");
		} else if(self.zoneIdRequiredMethods.indexOf(options.api_method) > -1 && !options.zone_id) {
			error = new Error("Parameter zone_id is required for the method requested.");
		} else if(self.timetableIdRequiredMethods.indexOf(options.api_method) > -1 && !options.timetable_id) {
			error = new Error("Parameter timetable_id is required for the method requested.");
		} else {
			error = null;
		}
		return error;
	}

	private callHttpApiGetMethod(connection: TadoConnection, options: any, callback: Function): void {
		const self = this;
		if (self.timetableIdRequiredMethods.indexOf(options.api_method) > -1) {
			connection.getClient()[options.api_method](options.home_id, options.zone_id, options.timetable_id).then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			})
		}
		else if (self.zoneIdRequiredMethods.indexOf(options.api_method) > -1) {
			connection.getClient()[options.api_method](options.home_id, options.zone_id).then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			})
		}
		else if (self.deviceIdRequiredMethods.indexOf(options.api_method) > -1) {
			connection.getClient()[options.api_method](options.home_id, options.device_id).then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			})
		}
		else if (self.homeIdRequiredMethods.indexOf(options.api_method) > -1) {
			connection.getClient()[options.api_method](options.home_id).then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			})
		}
	}

	sendMessage(id: string, options: any = {}, callback: Function): void {
		const self = this;
		const connection: TadoConnection = <TadoConnection> self.getConnection(id);
		const optionsError: Error = self.verifySendMessageBaseOptions(options);
		if (connection && !optionsError) {
			self.callHttpApiPutMethod(connection, options, callback);
		} else if (!connection) {
			callback(new Error("No connection on list with id: " + id));
		} else {
			callback(optionsError);
		}
	}

	private verifySendMessageBaseOptions(options: any): Error {
		const self = this;
		let error: Error
		if (!options.api_method) {
			error = new Error("Parameter api_method is required in Tado connector.");
		} else if(self.homeIdRequiredMethods.indexOf(options.api_method) > -1 && !options.home_id) {
			error = new Error("Parameter home_id is required for the method requested.");
		} else if(self.zoneIdRequiredMethods.indexOf(options.api_method) > -1 && !options.zone_id) {
			error = new Error("Parameter zone_id is required for the method requested.");
		} else if(self.powerTempRequiredMethods.indexOf(options.api_method) > -1 
			&& !options.power && !options.temperature && !options.termination) {
			error = new Error("Parameters power, temperature and termination are required for the method requested.");
		} else {
			error = null;
		}
		return error;
	}

	private callHttpApiPutMethod(connection: TadoConnection, options: any, callback: Function): void {
		const self = this;
		if (self.powerTempRequiredMethods.indexOf(options.api_method) > -1) {
			connection.getClient()[options.api_method](options.home_id, options.zone_id,
			 options.power, options.temperature, options.termination).then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			})
		}
		else if (self.zoneIdRequiredMethods.indexOf(options.api_method) > -1) {
			connection.getClient()[options.api_method](options.home_id, options.zone_id).then(function(response: any) {
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			})
		}
	}
}

export class TadoConnection extends Connection {
	private username: string;
	private password: string;
	private tadoClient: any;

	constructor(options: any) {
		super(options);
		this.username = options.username;
		this.password = options.password;
		this.tadoClient = new TadoClient();
	}

	getUsername(): string {
		return this.username;
	}

	getPassword(): string {
		return this.password;
	}

	getClient(): any {
		return this.tadoClient;
	}
}

export const connector = new TadoConnector();
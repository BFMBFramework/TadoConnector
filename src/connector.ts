/**
 * This file has both classes required for this module.
 */

import {Connector, Connection} from "bfmb-base-connector";
import * as TadoClient from "node-tado-client";

/**
 * Class TadoConnector. Extends Connector class from bfmb-base-connector module.
 */ 
export class TadoConnector extends Connector {

	/**
	 * This array is required for knowing which functions require the existence of home_id attribute.
	 */
	private homeIdRequiredMethods: string[] = [
	"getHome", "getWeather", "getDevices", "getInstallations",
	"getUsers", "getState", "getMobileDevices", "getMobileDevice",
	"getMobileDeviceSettings", "getZones", "getZoneState",
	"getZoneCapabilities","getZoneOverlay", "getTimeTables",
	"getAwayConfiguration", "getTimeTable", "clearZoneOverlay",
	"setZoneOverlay"
	];

	/**
	 * This array is required for knowing which functions require the existence of device_id attribute.
	 */
	private deviceIdRequiredMethods: string[] = [
	"getMobileDevice", "getMobileDeviceSettings"
	];

	/**
	 * This array is required for knowing which functions require the existence of zone_id attribute.
	 */
	private zoneIdRequiredMethods: string[] = [
	"getZoneState", "getZoneCapabilities","getZoneOverlay",
	"getTimeTables", "getAwayConfiguration", "getTimeTable",
	"clearZoneOverlay"
	];

	/**
	 * This array is required for knowing which functions require the existence of timetable_id attribute.
	 */
	private timetableIdRequiredMethods: string[] = ["getTimeTable"];

	/**
	 * This array is required for knowing which functions require the existence of power, temperature and termination attributes.
	 */
	private powerTempRequiredMethods: string[] = ["setZoneOverlay"];

	/**
	 * The constructor only calls to parent class passing the network identification.
	 */
	constructor() {
		super("Tado");
	}

	/**
	 * This method adds a TadoConnection object to the connector.
	 * @param options A not type-defined object. Requires the attributes **username** and **password** to be valid. Those values are the login data of Tadoº.
	 * @param callback Callback function which it gives the results or the failure of the task.
	 */
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

	/**
	 * This method calls to /me endpoint of Tadoº api.
	 * @param id The uuid of the connection to do the call.
	 * @param options A not type-defined object. Actually it's empty.
	 * @param callback Function which return response or error from the connection.
	 */
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

	/**
	 * This methods is the universal method for calling get methods of Tado client module.
	 * @param id The uuid of the connection to do the call.
	 */
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
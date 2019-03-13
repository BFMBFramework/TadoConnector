import {Connector, Connection} from "bfmb-base-connector";
import * as TadoClient from "node-tado-client";

export class TadoConnector extends Connector {

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
			self.callHttpApiGetMethod(connection, options, function(err: Error, response: any) {

			});
		} else if (!connection) {
			callback(new Error("No connection on list with id: " + id));
		} else {
			callback(optionsError);
		}
	}

	private verifyReceiveMessageBaseOptions(options: any): Error {
		let error: Error
		if (!options.api_method && !options.home_id) {
			error = new Error("Parameters api_method and home_id are required in Tado API.");
		} else {
			error = null;
		}
		return error;
	}

	private callHttpApiGetMethod(connection: TadoConnection, options: any, callback: Function): void {
		switch options.api_method
	}

	sendMessage(id: string, options: any = {}, callback: Function): void {
		callback(new Error("Not implemented yet"));
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
import {Connector, Connection} from "bfmb-base-connector";
import * as TadoClient from "node-tado-client";

export class TadoConnector extends Connector {

	constructor() {
		super("Tado");
	}

	addConnection(options : any, callback : Function) : void {
		const self = this;
		const connection : TadoConnection = new TadoConnection(options);

		connection.login();
		connection.getClient().getMe().then(function(response: any) {
			console.log(response);
			callback(null, response.id)
		})
		.catch(function(err : Error) {
			callback(err);
		});
	}

	receiveMessage(id : string, options : any = {}, callback : Function) : void{
		callback(new Error("Not implemented"));
	}

	sendMessage(id : string, options : any = {}, callback : Function) : void {
		callback(new Error("Not implemented"));
	}

}

export class TadoConnection extends Connection {
	private username : string;
	private password : string;
	private tadoClient : any;

	constructor (options: any) {
		super(options);
		this.username = options.username;
		this.password = options.password;
		this.tadoClient = new TadoClient();
	}

	login() {
		this.tadoClient.login(this.username, this.password);
	}

	getClient() : any {
		return this.tadoClient;
	}
}

export const connector = new TadoConnector();
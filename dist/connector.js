"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const TadoClient = require("node-tado-client");
class TadoConnector extends bfmb_base_connector_1.Connector {
    constructor() {
        super("Tado");
    }
    addConnection(options, callback) {
        const self = this;
        const connection = new TadoConnection(options);
        connection.login();
        connection.getClient().getMe().then(function (response) {
            console.log(response);
            callback(null, response.id);
        })
            .catch(function (err) {
            callback(err);
        });
    }
    receiveMessage(id, options = {}, callback) {
        callback(new Error("Not implemented"));
    }
    sendMessage(id, options = {}, callback) {
        callback(new Error("Not implemented"));
    }
}
exports.TadoConnector = TadoConnector;
class TadoConnection extends bfmb_base_connector_1.Connection {
    constructor(options) {
        super(options);
        this.username = options.username;
        this.password = options.password;
        this.tadoClient = new TadoClient();
    }
    login() {
        this.tadoClient.login(this.username, this.password);
    }
    getClient() {
        return this.tadoClient;
    }
}
exports.TadoConnection = TadoConnection;
exports.connector = new TadoConnector();

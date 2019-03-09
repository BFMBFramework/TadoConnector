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
        connection.getClient()
            .login(connection.getUsername(), connection.getPassword())
            .then(function (response) {
            self.connections.push(connection);
            callback(null, connection.getId());
        })
            .catch(function (err) {
            callback(err);
        });
    }
    getMe(id, options = {}, callback) {
        const self = this;
        const connection = self.getConnection(id);
        if (connection) {
            connection.getClient().getMe().then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
    }
    receiveMessage(id, options = {}, callback) {
        const self = this;
        const connection = self.getConnection(id);
        if (connection) {
        }
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
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getClient() {
        return this.tadoClient;
    }
}
exports.TadoConnection = TadoConnection;
exports.connector = new TadoConnector();

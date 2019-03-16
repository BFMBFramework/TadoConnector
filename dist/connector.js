"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const TadoClient = require("node-tado-client");
class TadoConnector extends bfmb_base_connector_1.Connector {
    constructor() {
        super("Tado");
        this.homeIdRequiredMethods = [
            "getHome", "getWeather", "getDevices", "getInstallations",
            "getUsers", "getState", "getMobileDevices", "getMobileDevice",
            "getMobileDeviceSettings", "getZones", "getZoneState",
            "getZoneCapabilities", "getZoneOverlay", "getTimeTables",
            "getAwayConfiguration", "getTimeTable", "clearZoneOverlay",
            "setZoneOverlay"
        ];
        this.deviceIdRequiredMethods = [
            "getMobileDevice", "getMobileDeviceSettings"
        ];
        this.zoneIdRequiredMethods = [
            "getZoneState", "getZoneCapabilities", "getZoneOverlay",
            "getTimeTables", "getAwayConfiguration", "getTimeTable",
            "clearZoneOverlay"
        ];
        this.timetableIdRequiredMethods = ["getTimeTable"];
        this.powerTempRequiredMethods = ["setZoneOverlay"];
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
        const optionsError = self.verifyReceiveMessageBaseOptions(options);
        if (connection && !optionsError) {
            self.callHttpApiGetMethod(connection, options, callback);
        }
        else if (!connection) {
            callback(new Error("No connection on list with id: " + id));
        }
        else {
            callback(optionsError);
        }
    }
    verifyReceiveMessageBaseOptions(options) {
        const self = this;
        let error;
        if (!options.api_method) {
            error = new Error("Parameter api_method is required in Tado connector.");
        }
        else if (self.homeIdRequiredMethods.indexOf(options.api_method) > -1 && !options.home_id) {
            error = new Error("Parameter home_id is required for the method requested.");
        }
        else if (self.deviceIdRequiredMethods.indexOf(options.api_method) > -1 && !options.device_id) {
            error = new Error("Parameter device_id is required for the method requested.");
        }
        else if (self.zoneIdRequiredMethods.indexOf(options.api_method) > -1 && !options.zone_id) {
            error = new Error("Parameter zone_id is required for the method requested.");
        }
        else if (self.timetableIdRequiredMethods.indexOf(options.api_method) > -1 && !options.timetable_id) {
            error = new Error("Parameter timetable_id is required for the method requested.");
        }
        else {
            error = null;
        }
        return error;
    }
    callHttpApiGetMethod(connection, options, callback) {
        const self = this;
        if (self.timetableIdRequiredMethods.indexOf(options.api_method) > -1) {
            connection.getClient()[options.api_method](options.home_id, options.zone_id, options.timetable_id).then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
        else if (self.zoneIdRequiredMethods.indexOf(options.api_method) > -1) {
            connection.getClient()[options.api_method](options.home_id, options.zone_id).then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
        else if (self.deviceIdRequiredMethods.indexOf(options.api_method) > -1) {
            connection.getClient()[options.api_method](options.home_id, options.device_id).then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
        else if (self.homeIdRequiredMethods.indexOf(options.api_method) > -1) {
            connection.getClient()[options.api_method](options.home_id).then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
    }
    sendMessage(id, options = {}, callback) {
        const self = this;
        const connection = self.getConnection(id);
        const optionsError = self.verifySendMessageBaseOptions(options);
        if (connection && !optionsError) {
            self.callHttpApiPutMethod(connection, options, callback);
        }
        else if (!connection) {
            callback(new Error("No connection on list with id: " + id));
        }
        else {
            callback(optionsError);
        }
    }
    verifySendMessageBaseOptions(options) {
        const self = this;
        let error;
        if (!options.api_method) {
            error = new Error("Parameter api_method is required in Tado connector.");
        }
        else if (self.homeIdRequiredMethods.indexOf(options.api_method) > -1 && !options.home_id) {
            error = new Error("Parameter home_id is required for the method requested.");
        }
        else if (self.zoneIdRequiredMethods.indexOf(options.api_method) > -1 && !options.zone_id) {
            error = new Error("Parameter zone_id is required for the method requested.");
        }
        else if (self.powerTempRequiredMethods.indexOf(options.api_method) > -1
            && !options.power && !options.temperature && !options.termination) {
            error = new Error("Parameters power, temperature and termination are required for the method requested.");
        }
        else {
            error = null;
        }
        return error;
    }
    callHttpApiPutMethod(connection, options, callback) {
        const self = this;
        if (self.powerTempRequiredMethods.indexOf(options.api_method) > -1) {
            connection.getClient()[options.api_method](options.home_id, options.zone_id, options.power, options.temperature, options.termination).then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
        else if (self.zoneIdRequiredMethods.indexOf(options.api_method) > -1) {
            connection.getClient()[options.api_method](options.home_id, options.zone_id).then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
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

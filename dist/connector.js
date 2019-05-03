"use strict";
/**
 * This file has both classes required for this module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const TadoClient = require("node-tado-client");
/**
 * Class TadoConnector. Extends Connector class from bfmb-base-connector module.
 */
class TadoConnector extends bfmb_base_connector_1.Connector {
    /**
     * The constructor only calls to parent class passing the network identification.
     */
    constructor() {
        super("Tado");
        /**
         * This array is required for knowing which functions require the existence of home_id attribute.
         */
        this.homeIdRequiredMethods = [
            "getHome", "getWeather", "getDevices", "getInstallations",
            "getUsers", "getState", "getMobileDevices", "getMobileDevice",
            "getMobileDeviceSettings", "getZones", "getZoneState",
            "getZoneCapabilities", "getZoneOverlay", "getTimeTables",
            "getAwayConfiguration", "getTimeTable", "clearZoneOverlay",
            "setZoneOverlay"
        ];
        /**
         * This array is required for knowing which functions require the existence of device_id attribute.
         */
        this.deviceIdRequiredMethods = [
            "getMobileDevice", "getMobileDeviceSettings"
        ];
        /**
         * This array is required for knowing which functions require the existence of zone_id attribute.
         */
        this.zoneIdRequiredMethods = [
            "getZoneState", "getZoneCapabilities", "getZoneOverlay",
            "getTimeTables", "getAwayConfiguration", "getTimeTable",
            "setZoneOverlay", "clearZoneOverlay"
        ];
        /**
         * This array is required for knowing which functions require the existence of timetable_id attribute.
         */
        this.timetableIdRequiredMethods = ["getTimeTable"];
        /**
         * This array is required for knowing which functions require the existence of power, temperature and termination attributes.
         */
        this.powerTempRequiredMethods = ["setZoneOverlay"];
    }
    /**
     * This method adds a TadoConnection object to the connector.
     * @param options A not type-defined object. Requires the attributes **username** and **password** to be valid. Those values are the login data of Tadoº.
     * @param callback Callback function which it gives the results or the failure of the task.
     */
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
    /**
     * This method calls to /me endpoint of Tadoº api.
     * @param id The uuid of the connection to do the call.
     * @param options A not type-defined object. Actually it's empty.
     * @param callback Function which return response or error from the connection.
     */
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
    /**
     * This method is the universal method for calling get methods of Tado client module.
     * @param id The uuid of the connection to do the call.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @param callback Function which return response or error from the connection.
     */
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
    /**
     * This method verifies that options object has the required attributes.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @return Error May return an error object if there's some issues with the options object.
     */
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
    /**
     * This method does the calling to Tado api.
     * @param connection The connection to Tado api.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @param callback Function which returns any result or error.
     * @return Error May return an error object if there's some issues with the options object.
     */
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
    /**
     * This method is the universal method for calling put/post methods of Tado client module.
     * @param id The uuid of the connection to do the call.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @param callback Function which return response or error from the connection.
     */
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
    /**
     * This method verifies that options object has the required attributes.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @return Error May return an error object if there's some issues with the options object.
     */
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
            && (!options.power || !options.temperature || !options.termination)) {
            error = new Error("Parameters power, temperature and termination are required for the method requested.");
        }
        else {
            error = null;
        }
        return error;
    }
    /**
     * This method does the calling to Tado api.
     * @param connection The connection to Tado api.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @param callback Function which returns any result or error.
     * @return Error May return an error object if there's some issues with the options object.
     */
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
/**
 * TadoConnection is the class which holds the required information and api client. Extends Connection class from bfmb-base-connector module.
 */
class TadoConnection extends bfmb_base_connector_1.Connection {
    /**
     * The constructor of TadoConnection. Username and password are given by options object.
     */
    constructor(options) {
        super(options);
        this.username = options.username;
        this.password = options.password;
        this.tadoClient = new TadoClient();
    }
    /**
     * This method retrieves the username.
     * @return string Returns the username.
     */
    getUsername() {
        return this.username;
    }
    /**
     * This method retrieves the password.
     * @return string Returns the password.
     */
    getPassword() {
        return this.password;
    }
    /**
     * This method retrieves the Tado client object.
     * @return any Returns the client class.
     */
    getClient() {
        return this.tadoClient;
    }
}
exports.TadoConnection = TadoConnection;
exports.connector = new TadoConnector();

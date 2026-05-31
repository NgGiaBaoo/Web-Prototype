const fs = require("fs");
const mysql = require("mysql2");
require("dotenv").config({ quiet: true });

function getEnvValue(keys, fallback = undefined) {
    for (const key of keys) {
        const value = process.env[key];

        if (value !== undefined && value !== "") {
            return value;
        }
    }

    return fallback;
}

function buildSslOptions() {
    const sslMode = String(getEnvValue(["DB_SSL", "AIVEN_SSL"], "")).toLowerCase();

    if (!["true", "required", "1", "yes"].includes(sslMode)) {
        return undefined;
    }

    const caPath = getEnvValue(["DB_SSL_CA_PATH", "AIVEN_CA_PATH"], "./ca.pem");

    return {
        ca: fs.readFileSync(caPath)
    };
}

function createConnection() {
    return mysql.createConnection({
        host: getEnvValue(["DB_HOST", "AIVEN_HOST"]),
        port: Number(getEnvValue(["DB_PORT", "AIVEN_PORT"], 3306)) || 3306,
        user: getEnvValue(["DB_USER", "AIVEN_USER"]),
        password: getEnvValue(["DB_PASSWORD", "AIVEN_PASSWORD"]),
        database: getEnvValue(["DB_NAME", "AIVEN_DATABASE", "AIVEN_DB_NAME"]),
        ssl: buildSslOptions()
    });
}

function establishConnection(dbConnection = createConnection()) {
    dbConnection.connect((err) => {
        if (err) {
            console.log("Loi ket noi");
            console.log(err);
            return;
        }

        console.log("Ket noi MySQL thanh cong");
    });
}

function query(sql, paramsOrCallback, maybeCallback) {
    if (typeof paramsOrCallback === "function" || typeof maybeCallback === "function") {
        const connection = createConnection();
        return connection.query(sql, paramsOrCallback, maybeCallback);
    }

    const params = Array.isArray(paramsOrCallback) ? paramsOrCallback : [];

    return new Promise((resolve, reject) => {
        const connection = createConnection();

        connection.query(sql, params, (error, results) => {
            connection.end(() => {});

            if (error) {
                return reject(error);
            }

            resolve(results);
        });
    });
}

function commitQuery(sql, paramsOrCallback, maybeCallback) {
    return query(sql, paramsOrCallback, maybeCallback);
}

function endConnection() {
    const connection = createConnection();

    connection.end((err) => {
        if (err) {
            console.error("Error ending the connection: ", err);
            return;
        }

        console.log("Connection ended successfully.");
    });
}

module.exports = {
    establishConnection,
    query,
    commitQuery,
    endConnection,
};
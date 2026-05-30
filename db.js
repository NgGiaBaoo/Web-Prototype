const fs = require("fs");
const mysql = require("mysql2");
require("dotenv").config({ quiet: true });

function buildSslOptions() {
    const sslMode = String(process.env.DB_SSL || "").toLowerCase();

    if (!["true", "required", "1", "yes"].includes(sslMode)) {
        return undefined;
    }

    const caPath = process.env.DB_SSL_CA_PATH || "./ca.pem";

    return {
        ca: fs.readFileSync(caPath)
    };
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: buildSslOptions()
});

function establishConnection(dbConnection = connection) {
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
    if (typeof paramsOrCallback === "function") {
        return connection.query(sql, paramsOrCallback);
    }

    if (typeof maybeCallback === "function") {
        return connection.query(sql, paramsOrCallback, maybeCallback);
    }

    const params = Array.isArray(paramsOrCallback) ? paramsOrCallback : [];

    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                return reject(error);
            }

            resolve(results);
        });
    });
}

function commitQuery(sql, paramsOrCallback, maybeCallback) {
    if (typeof paramsOrCallback === "function") {
        return connection.query(sql, paramsOrCallback);
    }

    if (typeof maybeCallback === "function") {
        return connection.query(sql, paramsOrCallback, maybeCallback);
    }

    const params = Array.isArray(paramsOrCallback) ? paramsOrCallback : [];

    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                return reject(error);
            }

            resolve(results);
        });
    });
}

function endConnection() {
    connection.end((err) => {
        if (err) {
            console.error("Error ending the connection: ", err);
            return;
        }

        console.log("Connection ended successfully.");
    });
}

module.exports = {
    connection,
    establishConnection,
    query,
    commitQuery,
    endConnection,
};
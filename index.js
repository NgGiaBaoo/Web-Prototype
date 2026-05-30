const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

db.establishConnection();

app.get("/api/dbconn", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM STUDENT");
        res.json({ query: results });
    } catch (error) {
        console.error("Query error: ", error);
        res.status(500).json({ error: "Database query failed" });
    }
});

app.get("/", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM STUDENT");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
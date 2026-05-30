const express = require("express");
const db = require("./db");

const app = express();
const port = 9999;
const TABLE_NAME = "STUDENT";

app.use(express.json());

db.establishConnection();

app.get("/health", (req, res) => {
    db.query("SELECT 1 AS ok")
        .then(() => {
            res.json({
                message: "Ket noi MySQL thanh cong",
                table: TABLE_NAME
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Loi ket noi MySQL",
                error: error.message
            });
        });
});

app.get("/students", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM ${TABLE_NAME}`);
        res.json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});

app.get("/students/:id", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM ${TABLE_NAME} WHERE SID = ?`,
            [req.params.id]
        );
        res.json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});

app.post("/students", async (req, res) => {

    const { SID, SNAME, EMAIL, Tutor_Id } = req.body;

    const sql = `
        INSERT INTO ${TABLE_NAME}
        (SID, SNAME, EMAIL, Tutor_Id)
        VALUES (?, ?, ?, ?)
    `;

    try {
        const result = await db.commitQuery(sql, [SID, SNAME, EMAIL, Tutor_Id]);

        res.json({
            message: "Them sinh vien thanh cong",
            result
        });
    } catch (error) {
        return res.status(500).json(error);
    }

});

app.put("/students/:id", async (req, res) => {

    const { SNAME, EMAIL, Tutor_Id } = req.body;

    const sql = `
        UPDATE ${TABLE_NAME}
        SET SNAME = ?, EMAIL = ?, Tutor_Id = ?
        WHERE SID = ?
    `;

    try {
        const result = await db.commitQuery(sql, [SNAME, EMAIL, Tutor_Id, req.params.id]);

        res.json({
            message: "Cap nhat sinh vien thanh cong",
            result
        });
    } catch (error) {
        return res.status(500).json(error);
    }

});

app.delete("/students/:id", async (req, res) => {

    try {
        const result = await db.commitQuery(
            `DELETE FROM ${TABLE_NAME} WHERE SID = ?`,
            [req.params.id]
        );

        res.json({
            message: "Xoa sinh vien thanh cong",
            result
        });
    } catch (error) {
        return res.status(500).json(error);
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
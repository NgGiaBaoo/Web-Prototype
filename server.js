const express = require("express");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const TABLE_NAME = process.env.DB_TABLE_NAME || "STUDENT";

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        message: "Server is running",
        table: TABLE_NAME
    });
});
      
// Xem danh sách sinh viên
app.get("/students", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM ${TABLE_NAME}`);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Xem thông tin sinh viên theo ID
app.get("/students/:id", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM ${TABLE_NAME} WHERE SID = ?`,
            [req.params.id]
        );
        res.json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Thêm sinh viên mới
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
        return res.status(500).json({ error: error.message });
    }
});

// Cập nhật thông tin sinh viên
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
        return res.status(500).json({ error: error.message });
    }
});

// Xóa sinh viên
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
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
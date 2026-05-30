# Web-Prototype
hoc web

## Ket noi MySQL ben ngoai

1. Tao file `.env` va dien cac gia tri ket noi MySQL.
2. Cap nhat `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` theo MySQL local hoac cloud.
3. Neu dung cloud co SSL, dat `DB_SSL=true` va `DB_SSL_CA_PATH=./ca.pem`.
4. Import `STUDENTREG.sql` vao database truoc khi chay server.
5. Chay `npm start`.

## API chinh

- `GET /api/dbconn` trong [index.js](index.js)
- `GET /students`, `GET /students/:id`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id` trong [sever.js](sever.js)

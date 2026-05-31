# Web-Prototype
Hướng dẫn nhanh: kết nối Aiven MySQL và thao tác CRUD trên bảng `STUDENT`.

## Yêu cầu
- Node.js và npm
- Dự án chứa `server.js` và `db.js`
- Thông tin kết nối Aiven (host, port, user, password, tên database) và file CA certificate

## 1. Cấu hình kết nối (file `.env`)
Tạo file `.env` ở thư mục gốc (repo đã có `.env.example`). Điền các biến sau:

```env
PORT=3000
DB_HOST=YOUR_AIVEN_HOST
DB_PORT=YOUR_AIVEN_PORT
DB_USER=YOUR_AIVEN_USER
DB_PASSWORD=YOUR_AIVEN_PASSWORD
DB_NAME=YOUR_AIVEN_DATABASE
DB_SSL=true
DB_SSL_CA_PATH=./ca.pem
```

Ghi chú:
- `DB_SSL=true` bật SSL. `DB_SSL_CA_PATH` trỏ tới file chứng chỉ CA (ví dụ `ca.pem`) tải từ Aiven.
## 2. Chạy server
```bash
npm install
npm start
```
## 3. Endpoints CRUD (ví dụ dùng `curl`)
- Health:
```bash
curl -X GET http://localhost:3000/health
```
- Lấy tất cả students:
```bash
curl -X GET http://localhost:3000/students
```
- Lấy student theo `SID`:
```bash
curl -X GET http://localhost:3000/students/1000
```
- Thêm student (POST):
```bash
curl -X POST http://localhost:3000/students \
	-H 'Content-Type: application/json' \
	-d '{"SID":"9090","SNAME":"Test Student","EMAIL":"test@example.com","Tutor_Id":"1000"}'
```
- Cập nhật student (PUT):
```bash
curl -X PUT http://localhost:3000/students/9090 \
	-H 'Content-Type: application/json' \
	-d '{"SNAME":"Test Student Updated","EMAIL":"updated@example.com","Tutor_Id":"1001"}'
```
- Xóa student (DELETE):
```bash
curl -X DELETE http://localhost:3000/students/9090
```
## 4. Test bằng Postman
1. Mở Postman, tạo Collection "Web-Prototype".
2. Tạo request theo các thông tin ở trên (base URL `http://localhost:3000`).
3. Lưu ý chuyển khả năng hiển thị sang public
3. Với POST/PUT chọn `Body` → `raw` → `JSON` và dán payload mẫu.

## 5. Bảo mật trước khi public
- Không commit `.env` hoặc `ca.pem` có credentials vào git. Nếu đã commit, xóa khỏi lịch sử và quay vòng (rotate) mật khẩu/keys trên Aiven.
- Thêm `.env` và file sensitive vào `.gitignore`.
---
File cấu hình đọc bởi code: [db.js](db.js) — kiểm tra tùy chọn SSL và biến môi trường.

Nếu muốn, tôi có thể tạo sẵn một Collection Postman (.json) để bạn import.



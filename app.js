const express = require('express');
const AppError = require('./utils/AppError');

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com" }
];

app.get('/users/secret', (req, res, next) => {
    // Kiểm tra header Authorization
    if (!req.headers.authorization) {
        // Ném lỗi 401 chưa xác thực
        return next(new AppError('Chưa xác thực', 401));
    }
    
    res.status(200).json({ success: true, message: "Khu vực bí mật" });
});

// 2. GET /users/:id: Tìm kiếm user theo ID
app.get('/users/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        // Ném lỗi 404 Không tìm thấy
        return next(new AppError('Không tìm thấy user', 404));
    }

    res.status(200).json({ success: true, data: user });
});

// 3. POST /users: Tạo user mới
app.post('/users', (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        // Ném lỗi 400 Bad Request (Thiếu dữ liệu)[cite: 11]
        return next(new AppError('Thiếu trường email', 400));
    }

    res.status(201).json({ success: true, message: "Tạo user thành công", email });
});

// --- GLOBAL ERROR HANDLING MIDDLEWARE ---
// Phải đặt cuối cùng và có đúng 4 tham số: err, req, res, next[cite: 11]
app.use((err, req, res, next) => {
    console.error("Lỗi xảy ra:", err.message); // Log ra console để debug

    // Lấy status code từ lỗi, mặc định 500 nếu không có[cite: 11]
    const statusCode = err.statusCode || 500;

    // Trả về JSON đúng format yêu cầu[cite: 11]
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server Bài 8 đang chạy tại http://localhost:${PORT}`);
});
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Cấu hình Database
const dbConfig = {
    host: process.env.DB_HOST || 'db', // 'db' là tên service trong Docker
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'testdb',
    port: 3306,
    connectTimeout: 3000
};

let dbConnection = null;
let isDbConnected = false;

// Hàm kết nối an toàn
function connectDB() {
    dbConnection = mysql.createConnection(dbConfig);
    dbConnection.connect(err => {
        if (err) {
            console.log('⚠️ Không kết nối được MySQL (Chạy chế độ Mock Data)');
            isDbConnected = false;
        } else {
            console.log('✅ Đã kết nối MySQL thành công!');
            isDbConnected = true;
            // Tạo bảng mẫu
            const sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))";
            dbConnection.query(sql);
        }
    });
}
connectDB();

app.get('/', (req, res) => res.send('Backend Node.js Running!'));

app.get('/api/data', (req, res) => {
    if (isDbConnected) {
        // Nếu có DB (Docker Local)
        dbConnection.query("INSERT INTO users (name) VALUES ('User from Docker')", () => {
             dbConnection.query("SELECT * FROM users", (err, results) => {
                if (err) return res.json({ message: "Lỗi Query DB" });
                res.json({ message: `Dữ liệu thật từ MySQL (Docker): ${results.length} records` });
            });
        });
    } else {
        // Nếu không có DB (Render Cloud)
        res.json({ message: "Hello from Cloud! (Mock Data Mode)" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
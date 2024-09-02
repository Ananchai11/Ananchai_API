const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());  // Ensure JSON middleware is used
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ComputerInventory'
});

db.connect(err => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to the database.');
});

// เพิ่มข้อมูล
app.post('/computers', (req, res) => {
    const { image, brand_name, model_name, serial_number, stock_quantity, price, cpu_speed, memory_capacity, hard_disk_capacity } = req.body;

    if (!image || !brand_name || !model_name || !serial_number || !stock_quantity || !price || !cpu_speed || !memory_capacity || !hard_disk_capacity) {
        return res.status(400).send({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน', status: false });
    }

    const sql = `INSERT INTO Computers (image, brand_name, model_name, serial_number, stock_quantity, price, cpu_speed, memory_capacity, hard_disk_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [image, brand_name, model_name, serial_number, stock_quantity, price, cpu_speed, memory_capacity, hard_disk_capacity], (err, result) => {
        if (err) {
            console.error('Error inserting computer:', err);
            return res.status(500).send({ message: 'Error saving data', status: false });
        }
        res.send({ message: 'Computer saved successfully', status: true });
    });
});

// ดึงข้อมูลคอมพิวเตอร์ตาม ID
app.get('/computers/:id', (req, res) => {
    const computerID = req.params.id;

    if (isNaN(computerID)) {
        return res.status(400).send({ message: 'Computer ID must be a number', status: false });
    }

    const sql = `SELECT * FROM Computers WHERE id = ?`;
    db.query(sql, [computerID], (err, results) => {
        if (err) {
            console.error('Error fetching computer:', err);
            return res.status(500).send({ message: 'Error fetching data', status: false });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'Computer not found', status: false });
        }
        res.send(results[0]);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

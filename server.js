require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql2');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// =======================
//   CORS (opsional)
// =======================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// =======================
//   DATABASE CONNECTION
// =======================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
});

// =======================
//       MQTT BROKER
// =======================
const options = {
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  keepalive: Number(process.env.MQTT_KEEPALIVE),
  reconnectPeriod: Number(process.env.MQTT_RECONNECT)
};

const client = mqtt.connect(options);

// variabel penyimpanan data realtime
let latestPH = null;
let latestServoStatus = null;

client.on('connect', () => {
  console.log('✅ Terhubung ke broker MQTT');

  // Subscribe TOPIC SERVO
  client.subscribe('Pemrowalawe', (err) => {
    if (err) console.log('❌ Gagal subscribe Pemrowalawe:', err);
    else console.log('📥 Subscribe: Pemrowalawe');
  });

  // Subscribe TOPIC SENSOR PH
  client.subscribe('Ph', (err) => {
    if (err) console.log('❌ Gagal subscribe Ph:', err);
    else console.log('📥 Subscribe: Ph');
  });
});

// =======================
//   MQTT MESSAGE HANDLER
// =======================
client.on('message', (topic, message) => {
  const payload = message.toString().trim();

  // ========== DATA SERVO ==========
  if (topic === 'Pemrowalawe') {
    latestServoStatus = payload;
    console.log(`📡 Status servo diterima: ${payload}`);
    return;
  }

  // ========== DATA SENSOR PH ==========
  if (topic === 'Ph') {
    latestPH = payload;
    console.log(`💧 pH diterima: ${payload}`);

    const sql = "INSERT INTO sensor_ph (sensor) VALUES (?)";
    db.query(sql, [payload], (err) => {
      if (err) console.log("❌ DB pH Error:", err);
      else console.log("📥 pH disimpan:", payload);
    });
  }
});

// =====================================
//   ENDPOINT KONTROL SERVO
// =====================================
app.post('/servo', (req, res) => {
  const { status } = req.body;

  if (status !== 'ON' && status !== 'OFF') {
    return res.status(400).json({
      success: false,
      message: "Status harus 'ON' atau 'OFF'"
    });
  }

  const topic = 'Pemrowalawe/Control';

  client.publish(topic, status, { qos: 1 }, (err) => {
    if (err) {
      console.log('❌ Gagal kirim ke MQTT:', err);
      return res.status(500).json({ success: false, message: "Gagal kirim ke servo" });
    }

    console.log(`📤 MQTT: ${status} → ${topic}`);

    const sql = "INSERT INTO servo (keterangan) VALUES (?)";
    db.query(sql, [status], (err) => {
      if (err) console.log("❌ DB Servo Error:", err);
      else console.log("📥 Servo status disimpan:", status);
    });

    res.json({
      success: true,
      message: `Perintah ${status} dikirim ke servo`
    });
  });
});

// =====================================
//   ENDPOINT GET DATA PH
// =====================================
app.get('/ph', (req, res) => {
  const sql = "SELECT sensor, timestamp FROM sensor_ph ORDER BY timestamp DESC LIMIT 1";

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: "DB error" });
    }

    if (rows.length === 0) {
      return res.json({ success: false, message: "Belum ada data pH" });
    }

    res.json({
      success: true,
      ph: rows[0].sensor,
      timestamp: rows[0].timestamp
    });
  });
});

// ================================
//        JALANKAN SERVER
// ================================
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

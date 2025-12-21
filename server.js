require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql2');
const app = express();

const port = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(express.json());

// =======================
//   CORS
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
  port: process.env.DB_PORT,
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
  keepalive: Number(process.env.MQTT_KEEPALIVE || 60),
  reconnectPeriod: Number(process.env.MQTT_RECONNECT || 2000)
};

const client = mqtt.connect(options);

// variabel penyimpanan realtime
let latestPH = null;
let latestServoStatus = null;

client.on('connect', () => {
  console.log('✅ Terhubung ke broker MQTT');

  client.subscribe('Pemrowalawe', (err) => {
    if (err) console.log('❌ Gagal subscribe Pemrowalawe:', err);
    else console.log('📥 Subscribe: Pemrowalawe');
  });

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

  if (topic === 'Pemrowalawe') {
    latestServoStatus = payload;
    console.log(`📡 Servo status diterima: ${payload}`);
    return;
  }

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

// ======================================================
//   ENDPOINT CONTROL SERVO MANUAL
// ======================================================
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
    db.query(sql, [status], () => {});

    res.json({
      success: true,
      message: `Perintah ${status} dikirim ke servo`
    });
  });
});

// ======================================================
//   GET DATA pH TERBARU
// ======================================================
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

// ======================================================
//   COUNTDOWN + SCHEDULE SERVO OTOMATIS
// ======================================================
let servoInterval = null;
let countdown = 0;
let intervalSeconds = 0;

function startCountdown() {
  console.log(`⏱️ Countdown dimulai: ${intervalSeconds} detik`);

  servoInterval = setInterval(() => {
    countdown--;

    console.log(`⏳ Countdown: ${countdown} detik`);

    if (countdown <= 0) {
      console.log("⏰ Countdown habis → Servo ON!");

      client.publish("Pemrowalawe/Control", "ON");

      db.query("INSERT INTO servo (keterangan) VALUES ('AUTO-ON')");

      setTimeout(() => {
        client.publish("Pemrowalawe/Control", "OFF");
        console.log("🔒 Servo OFF");

        db.query("INSERT INTO servo (keterangan) VALUES ('AUTO-OFF')");

        countdown = intervalSeconds;

      }, 5000);
    }

  }, 1000);
}

// ======================================================
//   SET SCHEDULE SERVO
// ======================================================
app.post('/servo/schedule', (req, res) => {
  const { seconds } = req.body;

  if (!seconds || seconds < 5) {
    return res.status(400).json({
      success: false,
      message: "Seconds harus lebih dari 5"
    });
  }

  intervalSeconds = seconds;
  countdown = seconds;

  if (servoInterval) clearInterval(servoInterval);

  startCountdown();

  // SIMPAN SCHEDULE KE DATABASE
  const sql = `
    INSERT INTO schedule_servo (time)
    VALUES (?)
  `;

  db.query(sql, [seconds, seconds], (err) => {
    if (err) {
      console.log("❌ DB Schedule Error:", err);
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan jadwal ke database"
      });
    }

    console.log("📥 Schedule servo disimpan ke database:", seconds);

    res.json({
      success: true,
      message: `Schedule servo dimulai setiap ${seconds} detik`,
      countdown
    });
  });
});

// ======================================================
//   GET COUNTDOWN
// ======================================================
app.get('/servo/countdown', (req, res) => {
  res.json({
    success: true,
    countdown,
    interval: intervalSeconds
  });
});

// ======================================================
//   RESET SCHEDULE
// ======================================================
app.post('/servo/schedule/reset', (req, res) => {
  if (servoInterval) clearInterval(servoInterval);

  countdown = 0;
  intervalSeconds = 0;

  db.query(`INSERT INTO schedule_servo (interval_detik, countdown_awal) VALUES (0,0)`);

  res.json({
    success: true,
    message: "Schedule servo direset"
  });

  console.log("🔁 Schedule servo di-reset");
});

// ================================
//        RUN SERVER
// ================================
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

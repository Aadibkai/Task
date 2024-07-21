const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "singup",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (name, email, password) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json("Server Error");
    }
    return res.json(data);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Missing credentials");
  }

  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json("Server Error");
    }

    if (results.length === 0) {
      return res.status(400).json("Invalid Credentials");
    }

    return res.json({ message: "Login successful" });
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM login";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json("Server Error");
    }

    return res.json(results);
  });
});

app.post("/saveUser", upload.single('imgUpload'), (req, res) => {
  const { name, email, mobileNo, designation, gender, courses } = req.body;
  const imgUpload = req.file ? req.file.filename : null;

  const sql = "INSERT INTO users (name, email, mobileNo, designation, gender, courses, imgUpload) VALUES (?)";
  const values = [name, email, mobileNo, designation, gender, JSON.stringify(courses), imgUpload];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json("Server Error");
    }
    return res.json(data);
  });
});

app.get('/usersdb', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
  });
});

// Define the getUserById function
const getUserById = (id, callback) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    if (result.length === 0) {
      return callback(null, null);
    }
    return callback(null, result[0]);
  });
};

app.get('/getUser/:id', (req, res) => {
  const userId = req.params.id;
  getUserById(userId, (err, user) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json("Server Error");
    }
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  });
});


// Define the updateUser function
const updateUser = (id, userData, callback) => {
  // Ensure courses is a valid JSON string
  let courses;
  try {
    courses = JSON.stringify(userData.courses);
  } catch (err) {
    return callback(new Error('Invalid courses data'), null);
  }

  const sql = 'UPDATE users SET name = ?, email = ?, mobileNo = ?, designation = ?, gender = ?, courses = ?, imgUpload = ? WHERE id = ?';
  const values = [userData.name, userData.email, userData.mobileNo, userData.designation, userData.gender, courses, userData.imgUpload, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      return callback(null, null); // No rows affected, meaning no user found with the given ID
    }
    return callback(null, result);
  });
};


app.put('/usersdb/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  // Log the incoming data for debugging
  console.log('Updating user with ID:', userId);
  console.log('User data:', userData);

  updateUser(userId, userData, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json("Server Error");
    }
    if (!result) {
      return res.status(404).send('User not found');
    }
    res.json({ message: "User updated successfully" });
  });
});




app.listen(8081, () => {
  console.log("Listening on port 8081");
});

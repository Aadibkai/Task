const bcrypt = require("bcryptjs");

// During signup:
const hashedPassword = bcrypt.hashSync(req.body.password, 10);
const values = [req.body.name, req.body.email, hashedPassword];

// During login:
const user = results[0];
const passwordMatch = bcrypt.compareSync(password, user.password);

if (passwordMatch) {
  return res.status(200).json({ message: "Login successful" });
} else {
  return res.status(400).json({ message: "Invalid email or password" });
}

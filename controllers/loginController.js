const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const db = require('../config/db');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password using argon2
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create JWT token with user details
    const token = jwt.sign(

      { name: user.name, user_sno:user.user_sno,email: user.email, role: user.role },
      ACCESS_TOKEN_SECRET, // Replace with your actual secret
      { expiresIn: '1h' }
    );

    console.log(token);
    console.log('The logged in user is :' , user);  

    res.status(200).json({ success:true,message: 'Login successful', token , role: user.role});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login', error });
  }
}

module.exports = { login };
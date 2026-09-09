const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    connection.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === '23505') {
          return res.status(400).json({ message: 'name ou email déjà utilisé.' });
        }
        return res.status(500).json({ message: 'Erreur serveur.' });
      }

      res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const login = (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'name et password requis.' });
  }

  const query = 'SELECT * FROM users WHERE name = $1';
  connection.query(query, [name], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    const results = result.rows;

    if (results.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { id_user: user.id_user, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id_user: user.id_user, name: user.name, email: user.email } });
  });
};

const getProfile = (req, res) => {
  const query = 'SELECT id_user, name, email, created_at FROM users WHERE id_user = $1';
  connection.query(query, [req.user.id_user], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    const results = result.rows;

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json(results[0]);
  });
};

module.exports = { register, login, getProfile };

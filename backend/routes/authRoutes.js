// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Verificar se o usuário já existe
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });
    if (results.length > 0) return res.status(400).json({ message: 'Usuário já existe' });

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o novo usuário no banco de dados
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
      [username, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao registrar usuário' });
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
      });
  });
});

// Rota de login de usuário
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });
    if (results.length === 0) return res.status(400).json({ message: 'Usuário não encontrado' });

    // Verificar a senha
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(400).json({ message: 'Senha incorreta' });

    // Criar um token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    res.json({ token });
  });
});

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(403).json({ message: 'Acesso negado, token não fornecido' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
      req.user = decoded; // Informações do usuário estão disponíveis para a próxima função
      next();
    });
  };

  
  
  // Rota protegida de exemplo
  router.get('/profile', verifyToken, (req, res) => {
    res.json({
      message: 'Acesso autorizado!',
      user: req.user, // Informações decodificadas do token
    });
  });
  
module.exports = router;

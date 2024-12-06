const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 3000;

dotenv.config();


app.use(cors()); // Permitir que o frontend se conecte
app.use(express.json()); // Para interpretar o corpo das requisições
app.use('/news', authRoutes);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
      console.log('Erro ao conectar ao MySQL:', err);
      return;
    }
    console.log('Conectado ao MySQL');
  });


  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
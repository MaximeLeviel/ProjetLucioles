const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'WebTeam',
  database: 'projetLuciole'
})

client.connect()

module.exports = router

router.post('/maraude', (req, res) =>{
  const maraude = req.body.maraude
  req.session.maraude = maraude
  res.json({message: 'Maraude selectionnée'})
})

router.get('/maraude', (req, res) =>{
  if (req.session.maraude === undefined){
    res.status(404).json({message: 'Pas de maraude sélectionée'})
  }
  res.json(req.session.maraude)
})

router.get('/emailExist', async (req, res) =>{
  const email = req.body.email

  const sql = "SELECT * FROM users WHERE email=$1"
  const result = await client.query({
    text: sql,
    values: [email] // ici name et description ne sont pas concaténées à notre requête
  })

  if (result.rowCount == 0){
    res.json({exist: false})
  }
  res.json({exist: true})
})

router.get('/admin/me', async (req, res) => {
  if(req.session.admin === true){
    res.json({admin: true})
    return
  }
  res.json({admin: false})
})

router.post('/admin/register', async (req, res) =>{
  if (req.session.admin === true){
    const email = req.body.email
    const password = req.body.password

    var sql = "SELECT * FROM admins WHERE email=$1"
    var result = await client.query({
      text: sql,
      values: [email] // ici name et description ne sont pas concaténées à notre requête
    })

    if(result.rowCount !== 0){
      res.status(401).json({ message: 'Admin already exist'})
      return
    }

    const hash = await bcrypt.hash(password, 10)

    sql = "INSERT INTO admins (email, password) VALUES ($1, $2)"
    result = await client.query({
      text: sql,
      values: [email, hash]
    })

    result = await client.query({text: "SELECT id, email FROM admins"})
    res.json(result.rows)
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.post('/admin/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const sql = "SELECT * FROM admins WHERE email=$1"
  const result = await client.query({
    text: sql,
    values: [email]
  })

  if(result.rowCount === 0){
    res.status(401).json({ message: 'User does not already exist, please register first.'})
    return
  }

  if (! await bcrypt.compare(password, result.rows[0].password)){
    res.status(401).json({message: 'Wrong password'})
    return
  }

  req.session.adminId = result.rows[0].id
  req.session.admin = true
  
  res.json({connected: true, message: 'You are now logged in as an admin.'})
})

router.delete('/admin/:id', async (req, res) => {
  if (req.session.admin === true){
    const deleteAdmin = req.params.id
    if (deleteAdmin == req.session.adminId){
      res.status(401).json({message: "You can't delete the current admin"})
      return
    }
    const sql = "DELETE FROM admins WHERE id=$1"
    var result = await client.query({
      text: sql,
      values: [deleteAdmin]
    })

    result = await client.query({text: "SELECT id, email FROM admins"})
    res.json(result.rows)
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.get('/admin/admins', async (req, res) =>{
  if (req.session.admin === true){
    const result = await client.query({text: "SELECT id, email FROM admins"})
    res.json({currentId: req.session.adminId, administrateurs: result.rows})
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})
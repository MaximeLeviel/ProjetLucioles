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

router.get('/admin/me', (req, res) => {
  
  res.json({admin: true})
})

router.post('/admin/login', (req, res) => {
  //not implemented
  res.json({connected: true})
})
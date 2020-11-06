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


//Start of admin part
router.get('/admin/me', async (req, res) => {
  if(req.session.admin === true){
    res.json({admin: true})
    return
  }
  res.json({admin: false})
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

//admin management
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

//Maraudes management
router.post('/admin/maraude', async (req, res) => {
  if (req.session.admin === true){
    const jour = req.body.jour
    const mois = req.body.mois
    const annee = req.body.annee
    const heure = req.body.heure
    const trajet = req.body.trajet
    const nbParticipants = req.body.nbParticipants
    const nom = req.body.nom
    
    const sql = "INSERT INTO maraudes (jour, mois, annee, heure, type, nombre_participants, nombre_volontaires, nom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
    await client.query({
      text: sql,
      values: [jour, mois, annee, heure, trajet, nbParticipants, 0, nom]
    })
    res.json({message: "Maraude créé."})
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.put('/admin/maraude', async (req, res) => {
  if (req.session.admin === true){
    var values = []
    var sql = "UPDATE maraudes\nSET"
    if (req.req.body.jour !== undefined){
      const jour = req.body.jour
      sql += "jour = $" + (values.length + 1)
      values.push(jour)
    }
    if (req.req.body.mois !== undefined){
      const mois = req.body.mois
      if (values.length !== 0){
        sql += ","
      }
      sql += "mois = $" + (values.length + 1)
      values.push(mois)
    }
    if (req.req.body.annee !== undefined){
      const annee = req.body.annee
      if (values.length !== 0){
        sql += ","
      }
      sql += "annee = $" + (values.length + 1)
      values.push(annee)
    }
    if (req.req.body.heure !== undefined){
      const heure = req.body.heure
      if (values.length !== 0){
        sql += ","
      }
      sql += "heure = $" + (values.length + 1)
      values.push(heure)
    }
    if (req.req.body.trajet !== undefined){
      const trajet = req.body.trajet
      if (values.length !== 0){
        sql += ","
      }
      sql += "type = $" + (values.length + 1)
      values.push(trajet)
    }
    if (req.req.body.nbParticipants !== undefined){
      const nbParticipants = req.body.nbParticipants
      if (values.length !== 0){
        sql += ","
      }
      sql += "nombre_participants = $" + (values.length + 1)
      values.push(nbParticipants)
    }

    if (req.req.body.nom !== undefined){
      const nom = req.body.nom
      if (values.length !== 0){
        sql += ","
      }
      sql += "nom = $" + (values.length + 1)
      values.push(nom)
    }

    sql += "WHERE id = " + req.body.id
    
    await client.query({
      text: sql,
      values: values
    })
    res.json({message: "Maraude modifiée."})
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.post('/admin/trajet', async (req, res) => {
  if (req.session.admin === true){    
    const nom = req.body.nom
    const depart = req.body.depart
    const arrivee = req.body.arrivee
    const trajet = req.body.trajet
    console.log({trajet: trajet})
    const sql = "INSERT INTO trajets (nom, depart, arrivee, trajet) VALUES ($1, $2, $3, $4)"
    await client.query({
      text: sql,
      values: [nom, depart, arrivee, trajet]
    })
    res.json({message: "Trajet créé."})
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

//End of admin part

router.get('/maraudes', async (req, res) => {
  const today = new Date()
  //TODO changer requete pour pas afficher anciennes maraudes
  const result = await client.query({text: "SELECT * FROM maraudes\nORDER BY annee, mois, jour"})
  res.json(result.rows)
  return
})

router.get('/trajets', async (req, res) => {
  const result = await client.query({text: "SELECT * FROM trajets"})
  res.json(result.rows)
  return
})
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

router.get('/admin/users', async (req, res) =>{
  if (req.session.admin === true){
    var result = await client.query({text: "SELECT * FROM participants"})
    var data = result.rows
    console.log(result)
    console.log(data)
    for (var i = 0; i < data.length; i++){
      data[i].maraudes = []
      const sql = "SELECT nom, jour, mois, annee FROM maraudes WHERE maraude_id=$1"
      for (var j = 0; j < data[i].participations.length; j++){
        console.log(data[i].participations[j])
        result = await client.query({
          text: sql,
          values: [data[i].participations[j]],
        })
        console.log(result)
        data[i].maraudes.push(result.rows[0])
      }
    }
    res.json(data)
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.delete('/admin/user/:id', async (req, res) => {
  if (req.session.admin === true){
    const id = req.params.id
    const sql = "DELETE FROM participants WHERE id=$1"
    await client.query({
      text: sql,
      values: [id],
    })
    res.json({message: "Utilisateur supprimé."})
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
    
    const sql = "INSERT INTO maraudes (jour, mois, annee, heure, type, nombre_participants, nombre_volontaires, nom, participants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
    await client.query({
      text: sql,
      values: [jour, mois, annee, heure, trajet, nbParticipants, 0, nom, "{}"]
    })
    res.json({message: "Maraude créé."})
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.put('/admin/maraude', async (req, res) => {
  if (req.session.admin === true){
    var values = []
    var sql = "UPDATE maraudes\nSET "
    if (req.body.jour !== undefined){
      const jour = req.body.jour
      sql += "jour = $" + (values.length + 1)
      values.push(jour)
    }
    if (req.body.mois !== undefined){
      console.log("test1")
      const mois = req.body.mois
      if (values.length !== 0){
        sql += ","
      }
      sql += "mois = $" + (values.length + 1)
      values.push(mois)
      console.log("test2")
    }
    if (req.body.annee !== undefined){
      const annee = req.body.annee
      if (values.length !== 0){
        sql += ","
      }
      sql += "annee = $" + (values.length + 1)
      values.push(annee)
    }
    if (req.body.heure !== undefined){
      const heure = req.body.heure
      if (values.length !== 0){
        sql += ","
      }
      sql += "heure = $" + (values.length + 1)
      values.push(heure)
    }
    if (req.body.trajet !== undefined){
      const trajet = req.body.trajet
      if (values.length !== 0){
        sql += ","
      }
      sql += "type = $" + (values.length + 1)
      values.push(trajet)
    }
    if (req.body.nbParticipants !== undefined){
      const nbParticipants = req.body.nbParticipants
      if (values.length !== 0){
        sql += ", "
      }
      sql += "nombre_participants = $" + (values.length + 1)
      values.push(nbParticipants)
    }

    if (req.body.nom !== undefined){
      const nom = req.body.nom
      if (values.length !== 0){
        sql += ","
      }
      sql += "nom = $" + (values.length + 1)
      values.push(nom)
    }
    
    console.log("test3")

    sql += " WHERE maraude_id = " + req.body.maraude_id
    
    console.log("test4")
    console.log(sql)
    console.log(values)

    await client.query({
      text: sql,
      values: values
    })
    
    console.log("test5")
    res.json({message: "Maraude modifiée."})
    return
  }
  res.status(400).json({message: "User not connected as an admin."})
})

router.delete('/admin/maraude/:id', async (req, res) => {
  if (req.session.admin === true){
    const deleteMaraude = req.params.id
    const sql = "DELETE FROM maraudes WHERE maraude_id=$1"
    var result = await client.query({
      text: sql,
      values: [deleteMaraude]
    })
    
    res.json({message: "Maraude supprimée."})
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
    const sql = "INSERT INTO trajets (nom_trajet, depart, arrivee, trajet) VALUES ($1, $2, $3, $4)"
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

router.get('/maraudesTrajets', async(req, res) => {
  const result = await client.query({text: "SELECT * FROM maraudes\nINNER JOIN trajets ON maraudes.type=trajets.trajet_id\nORDER BY maraudes.annee, maraudes.mois, maraudes.jour"})
  res.json(result.rows)
  console.log(result.rows)
})

router.get('/maraude/:id', async (req,res) => {
  const sql = "SELECT *\nFROM maraudes\nINNER JOIN trajets ON maraudes.type=trajets.trajet_id AND maraudes.maraude_id=$1"
  const maraudeId = req.params.id
  console.log(sql)
  console.log(maraudeId)
  const result = await client.query({
    text: sql,
    values: [maraudeId]
  })
  console.log(result)
  res.json(result.rows)
})

router.get('/trajets', async (req, res) => {
  const result = await client.query({text: "SELECT * FROM trajets"})
  res.json(result.rows)
  return
})

router.post('/email', async (req, res) => {
  const email = req.body.email
  const participantID = await getIdParticipant(email)
  if(participantID === false){
    res.json({connu: false, message: "Participant non inscrit."})
    return
  }

  const maraudeId = req.body.id
  var sql = "UPDATE participants SET nombre_participations = nombre_participations + 1, participations = array_append(participations, $1) WHERE email = $2"
  await client.query({
    text: sql,
    values: [maraudeId, email]
  })
  await inscriptionMaraude(participantID, maraudeId)
  res.json({connu: false, message: "Participant inscrit."})
})

router.post('/participant', async (req, res) => {
  const email = req.body.email
  var sql = "SELECT id FROM participants WHERE email = $1"
  var result = await client.query({
    text: sql,
    values: [email]
  })
  if(result.rowCount !== 0){
    res.json({message: "L'adresse mail est déjà utilisée."})
    return
  }
  const nom = req.body.nom
  const prenom = req.body.prenom
  const telephone = req.body.phone
  const maraudeId = req.body.id
  console.log(typeof maraudeId)
  sql = "INSERT INTO participants (nom, prenom, email, telephone, participations, nombre_participations) VALUES ($1, $2, $3, $4, $5, $6)"
  await client.query({
    text: sql,
    values: [nom, prenom, email, telephone, "{"+maraudeId+"}", 1]
  })
  console.log("done")
  const participantID = await getIdParticipant(email)
  await inscriptionMaraude(participantID, maraudeId)
  res.json({message: "Participant enregistré et inscrit"})
})

async function inscriptionMaraude(participantId, maraudeId){
  console.log(participantId)
  const sql = "UPDATE maraudes SET nombre_volontaires = nombre_volontaires + 1, participants = array_append(participants, $1) WHERE maraude_id = $2"
  const result = await client.query({
    text: sql,
    values: [participantId, maraudeId]
  })
  return result
}

async function getIdParticipant(email){
  const sql = "SELECT id FROM participants WHERE email = $1"
  const result = await client.query({
    text: sql,
    values: [email]
  })
  if (result.rowCount === 0){
    return false
  }
  return result.rows[0].id
}
const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'WebTeam',
  database: 'projetLucioles'
})

client.connect()

module.exports = router

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

    const sql1 = "SELECT * FROM admins WHERE email=$1"
    const result1 = await client.query({
      text: sql1,
      values: [email] // ici name et description ne sont pas concaténées à notre requête
    })

    if(result1.rowCount !== 0){
      res.status(401).json({ message: 'Admin already exist'})
      return
    }

    const hash = await bcrypt.hash(password, 10)

    const sql2 = "INSERT INTO admins (email, password) VALUES ($1, $2)"
    await client.query({
      text: sql2,
      values: [email, hash]
    })

    const result2 = await client.query({text: "SELECT id, email FROM admins"})
    res.json(result2.rows)
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.delete('/admin/:id', async (req, res) => {
  if (req.session.admin === true){
    const deleteAdmin = req.params.id
    if (deleteAdmin === req.session.adminId){
      res.status(401).json({message: "You can't delete the current admin"})
      return
    }
    const sql = "DELETE FROM admins WHERE id=$1"
    await client.query({
      text: sql,
      values: [deleteAdmin]
    })

    const result = await client.query({text: "SELECT id, email FROM admins"})
    res.json(result.rows)
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.get('/admin/admins', async (req, res) =>{
  if (req.session.admin === true){
    const result = await client.query({text: "SELECT id, email FROM admins"})
    res.json({currentId: req.session.adminId, administrateurs: result.rows})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.get('/admin/users', async (req, res) =>{
  if (req.session.admin === true){
    const result1 = await client.query({text: "SELECT * FROM participants"});
    const data = result1.rows;
    for (let i = 0; i < data.length; i++){
      data[i].maraudes = []
      const sql = "SELECT nom_maraude, jour, mois, annee, maraude_id FROM maraudes WHERE maraude_id=$1"
      for (let j = 0; j < data[i].participations.length; j++){
        const result2 = await client.query({
          text: sql,
          values: [data[i].participations[j]],
        })
        data[i].maraudes.push(result2.rows[0])
      }
    }
    res.json(data)
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
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
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
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
    
    const sql = "INSERT INTO maraudes (jour, mois, annee, heure, type, nombre_participants, nombre_volontaires, nom_maraude, participants, objets) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
    await client.query({
      text: sql,
      values: [jour, mois, annee, heure, trajet, nbParticipants, 0, nom, "{}", "{}"]
    })
    res.json({message: "Maraude créé."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.put('/admin/maraude', async (req, res) => {
  if (req.session.admin === true){
    const jour = req.body.jour
    const mois = req.body.mois
    const annee = req.body.annee
    const heure = req.body.heure
    const trajet = req.body.trajet
    const nbParticipants = req.body.nbParticipants
    const nom = req.body.nom
    const id = req.body.id
    const sql = "UPDATE maraudes\nSET jour=$1, mois=$2, annee=$3, heure=$4, type=$5, nombre_participants=$6, nom_maraude=$7 WHERE maraude_id=$8"
    
    await client.query({
      text: sql,
      values: [jour, mois, annee, heure, trajet, nbParticipants, nom, id]
    })
    
    res.json({message: "Maraude modifiée."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.delete('/admin/maraude/:id', async (req, res) => {
  if (req.session.admin === true){
    const deleteMaraude = req.params.id
    const sql = "DELETE FROM maraudes WHERE maraude_id=$1"
    await client.query({
      text: sql,
      values: [deleteMaraude]
    })
    
    res.json({message: "Maraude supprimée."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.get('/admin/maraudesUtilisateurs', async (req, res) =>{
  if (req.session.admin === true){
    const result = await client.query({text: "SELECT * FROM maraudes\nORDER BY annee, mois, jour"});
    for(let i = 0; i < result.rowCount; i++){
      for(let j = 0; j < result.rows[i].participants.length; j++){
        const sql = "SELECT id, nom, prenom, email, telephone FROM participants WHERE id = $1"
        const result2 = await client.query({
          text: sql,
          values: [result.rows[i].participants[j]]
        })
        result.rows[i].participants[j] = result2.rows[0]
      }
      for(let j = 0; j< result.rows[i].objets.length; j++){
        const sql = "SELECT * FROM doleances WHERE id = $1"
        const result2 = await client.query({
          text: sql,
          values: [result.rows[i].objets[j]]
        })
        result.rows[i].objets[j] = result2.rows[0]
      }
    }
    console.log({result: result.rows})
    res.json(result.rows)
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.post('/admin/trajet', async (req, res) => {
  if (req.session.admin === true){    
    const nom = req.body.nom
    const depart = req.body.depart
    const arrivee = req.body.arrivee
    const trajet = req.body.trajet
    const sql = "INSERT INTO trajets (nom_trajet, depart, arrivee, trajet) VALUES ($1, $2, $3, $4)"
    await client.query({
      text: sql,
      values: [nom, depart, arrivee, trajet]
    })
    res.json({message: "Trajet créé."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.post('/admin/doleance', async (req, res) =>{
  if (req.session.admin === true) {
    const objet = req.body.objet
    const description = req.body.description
    const lieu = req.body.lieu
    const trajet = req.body.trajet

    if (lieu == null) {
      res.json({message: "Une position est necessaire."})
      return
    }
    const sql = "INSERT INTO doleances (objet, description, lieu, trajet_associe, visible) VALUES ($1, $2, $3, $4, $5)"
    await client.query({
      text: sql,
      values: [objet, description, lieu, trajet, true],
    })
    res.json({message: "Doleance enregistrée."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.put('/admin/doleance', async (req, res) =>{
  if (req.session.admin === true){
    const doleanceId = req.body.id
    const objet = req.body.objet
    const description = req.body.description
    const lieu = req.body.lieu
    const trajet = req.body.trajet_associe
    const visible = req.body.visible

    if (lieu == null) {
      res.json({message: "Une position est necessaire."})
      return
    }
    const sql = "UPDATE doleances\nSET objet=$1, description=$2, lieu=$3, trajet_associe=$4, visible=$5 WHERE id=$6"
    await client.query({
      text: sql,
      values: [objet, description, lieu, trajet, visible, doleanceId]
    })

    res.json({message: "Doleance modifiée."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

router.delete('/admin/doleance/:id', async (req, res) =>{
  if (req.session.admin === true){
    const doleance = req.params.id
    const sql = "DELETE FROM doleances WHERE id=$1"
    await client.query({
      text: sql,
      values: [doleance]
    })
    
    res.json({message: "Doleance supprimée."})
    return
  }
  res.status(400).json({message: "L'utilisateur n'a pas les droits administrateurs."})
})

//End of admin part

router.get('/maraudes', async (req, res) => {
  const today = new Date()
  //TODO changer requete pour pas afficher anciennes maraudes
  const result = await client.query({text: "SELECT * FROM maraudes\nORDER BY annee, mois, jour"})
  res.json(result.rows)
})

router.get('/maraudesTrajets', async(req, res) => {
  const result = await client.query({text: "SELECT * FROM maraudes\nINNER JOIN trajets ON maraudes.type=trajets.trajet_id\nORDER BY maraudes.annee, maraudes.mois, maraudes.jour"})
  res.json(result.rows)
})

router.get('/maraude/:id', async (req,res) => {
  const sql = "SELECT *\nFROM maraudes\nINNER JOIN trajets ON maraudes.type=trajets.trajet_id AND maraudes.maraude_id=$1"
  const maraudeId = req.params.id
  const result = await client.query({
    text: sql,
    values: [maraudeId]
  })
  res.json(result.rows)
})

router.get('/trajets', async (req, res) => {
  const result = await client.query({text: "SELECT * FROM trajets"})
  res.json(result.rows)
})

router.post('/email', async (req, res) => {
  const maraudeId = req.body.id
  const placesRestantes = await isFull(maraudeId)

  if(placesRestantes === false){
    res.json({message: "Limite de participants atteinte."})
    return
  }

  const email = req.body.email

  if (!email.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
    res.json({message: "Le format de l'adresse mail n'est pas valide. Veuillez entrer une adresse amil valide."})
  }

  const participantID = await getIdParticipant(email)
  if(participantID === false){
    res.json({connu: false, message: "Participant non inscrit."})
    return
  }
  var sql = "SELECT participations FROM participants WHERE id=$1"
  const result = await client.query({
    text: sql,
    values: [participantID]
  })

  for(var i = 0; i < result.rows[0].participations.length; i++){
    if(result.rows[0].participations[i] === maraudeId){
      res.json({connu: true, message: "Participant déjà inscrit."})
      return
    }
  }

  const objets = req.body.objets
  sql = "UPDATE participants SET nombre_participations = nombre_participations + 1, participations = array_append(participations, $1), nombre_objets = nombre_objets + $2, objets = array_cat(objets, $3) WHERE email = $4"
  await client.query({
    text: sql,
    values: [maraudeId, objets.length, objets, email]
  })
  await inscriptionMaraude(participantID, maraudeId, objets)
  res.json({connu: true, message: "Participant inscrit."})
})

router.post('/participant', async (req, res) => {
  const maraudeId = req.body.id
  
  const placesRestantes = await isFull(maraudeId)

  if(placesRestantes === false){
    res.json({message: "Limite de participants atteinte."})
    return
  }

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
  const objets = req.body.objets
  sql = "INSERT INTO participants (nom, prenom, email, telephone, participations, nombre_participations, nombre_objets, objets) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
  await client.query({
    text: sql,
    values: [nom, prenom, email, telephone, "{"+maraudeId+"}", 1, objets.length, objets]
  })

  const participantID = await getIdParticipant(email)
  await inscriptionMaraude(participantID, maraudeId, objets)
  res.json({message: "Participant enregistré et inscrit"})
})

async function inscriptionMaraude(participantId, maraudeId, objets){
  const sql = "UPDATE maraudes SET nombre_volontaires = nombre_volontaires + 1, participants = array_append(participants, $1), objets = array_cat(objets, $2) WHERE maraude_id = $3"
  await client.query({
    text: sql,
    values: [participantId, objets, maraudeId]
  })
  const sql2 = "UPDATE doleances SET visible = FALSE WHERE id = $1"
  for (let i = 0; i < objets.length; i++){
    await client.query({
      text: sql2,
      values: [objets[i]]
    })
  }
}

async function isFull(maraudeId){
  const sql = "SELECT nombre_participants, nombre_volontaires FROM maraudes WHERE maraude_id = $1"
  const result = await client.query({
    text: sql,
    values: [maraudeId],
  })
  return result.rows[0].nombre_participants > result.rows[0].nombre_volontaires;

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

router.get('/doleances', async (req, res) => {
  const result = await client.query({text: "SELECT doleances.id, doleances.lieu, doleances.coordonnees, doleances.objet, doleances.description, doleances.visible, doleances.trajet_associe, trajets.nom_trajet FROM doleances, trajets WHERE (trajets.trajet_id = doleances.trajet_associe)"})
  res.json(result.rows)
})

router.get('/doleance/trajet/:id', async (req, res) => {
  const trajet_id = req.params.id
  const sql = "SELECT * FROM doleances WHERE trajet_associe = $1 AND visible = true"
  const result = await client.query(({
    text: sql,
    values: [trajet_id]
  }))
  if(result.rowCount === 0){
    res.json(null)
    return
  }
  res.json(result.rows)
})
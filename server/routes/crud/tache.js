const express = require('express');
const router = express.Router();
const DB = require("../../config/db");


router.post("/tache", (req, res) => {
  const { libelle, type } = req.body;
  const id_user = req.user.id_user
  const sql_insert_tache =id_user?
    "INSERT INTO tache(libelle,type,id_user) VALUES($1,$2,$3) RETURNING id_tache"
    :
    "INSERT INTO tache(libelle,type) VALUES($1,$2) RETURNING id_tache";
  DB.query(sql_insert_tache,id_user? [libelle, type,id_user]:[libelle,type], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});
router.get("/tache", (req, res) => {
    const id_user = req.user.id_user
  
  const sql_get_tache =id_user? "SELECT * FROM tache WHERE id_user=$1":"SELECT * FROM tache";
  DB.query(sql_get_tache,id_user? [id_user]:[], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows);
    }
  });
});
router.delete("/tache/:id", (req, res) => {
  const id_tache = req.params.id;
  const sql_del_tache = "DELETE FROM tache WHERE id_tache = $1";
  DB.query(sql_del_tache, [id_tache], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router
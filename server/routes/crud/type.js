const express = require('express');
const router = express.Router();
const DB = require("../../config/db");

router.post("/type", (req, res) => {
  const { libelle } = req.body;
  const id_user = req.user.id_user
  const sql_insert_type =
  id_user?
    "INSERT INTO type(libelle,id_user) VALUES($1,$2) RETURNING id_type"
    :
    "INSERT INTO type(libelle) VALUES($1) RETURNING id_type";
  DB.query(sql_insert_type,id_user? [libelle,id_user]:[libelle], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});
router.get("/type", (req, res) => {
    const id_user = req.user.id_user
    
  const sql_get_type =id_user? "SELECT * FROM type WHERE id_user=$1" : "SELECT * FROM type";
  DB.query(sql_get_type,id_user? [id_user]:[], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});
router.delete("/type/:id", (req, res) => {
  const id_type = req.params.id;
  const sql_del_type = "DELETE FROM type WHERE id_type = $1 RETURNING libelle";
  DB.query(sql_del_type, [id_type], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      const sql_del_objectif = "DELETE FROM objectif WHERE type = $1";
      DB.query(sql_del_objectif, [result.rows[0].libelle], (err, result) => {
        if (err) {
          console.error("Erreur DB: ", err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = router
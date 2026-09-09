const express = require('express');
const router = express.Router();
const DB = require("../../config/db");

router.post("/assignation", (req, res) => {
  const { libelle, jour, id_semaine, id_tache } = req.body;
  const id_user = req.user.id_user
  const sql_insert_assing =
    "INSERT INTO assignation(libelle,jour,id_semaine,etat,id_tache,id_user) VALUES($1,$2,$3,$4,$5,$6) RETURNING id_ass";
  DB.query(
    sql_insert_assing,
    [libelle, jour, id_semaine, "en_attente", id_tache,id_user],
    (err, result) => {
      if (err) {
        console.error("Erreur DB: ", err);
        res.sendStatus(500);
      } else {
        res.status(200).json(result);
      }
    },
  );
});

router.get("/assignation", (req, res) => {
    const id_user = req.user.id_user
  const sql_get_assignation = "SELECT * FROM assignation WHERE id_user=$1";
  DB.query(sql_get_assignation, [id_user], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});

router.put("/assignation/:id", (req, res) => {
  const id_ass = req.params.id;
  const { etat } = req.body;
  const sql_modif_ass = "UPDATE assignation SET etat=$1 WHERE id_ass=$2";
  DB.query(sql_modif_ass, [etat, id_ass], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete("/assignation/:id", (req, res) => {
  const id_ass = req.params.id;
  const sql_del_ass = "DELETE FROM assignation WHERE id_ass = $1";
  DB.query(sql_del_ass, [id_ass], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});


module.exports = router
const express = require('express');
const router = express.Router();
const DB = require("../../config/db");


router.get("/kairos/objectif", (req, res) => {
    const id_user = req.user.id_user
  const sql_get_objectif = id_user?
   "SELECT * FROM objectif WHERE id_user = $1"
   :
   "SELECT * FROM objectif";
  DB.query(sql_get_objectif,id_user? [id_user]:[], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});

router.post("/kairos/objectif", (req, res) => {
  let { libelle, type } = req.body;
  const id_user = req.user.id_user
  const sql_insert_objectif =id_user?
    "INSERT INTO objectif(type,libelle,etat,id_user) VALUES($1,$2,$3,$4) RETURNING id_objectif"
    :
    "INSERT INTO objectif(type,libelle,etat) VALUES($1,$2,$3) RETURNING id_objectif";
  DB.query(
    sql_insert_objectif,
    id_user?
    [type, libelle, "en_attente",id_user]
    :
    [type, libelle, "en_attente"],
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

router.delete("/kairos/objectif/:id", (req, res) => {
  const id_objectif = req.params.id;
  const sql_del_objectif = "DELETE FROM objectif WHERE id_objectif = $1";
  DB.query(sql_del_objectif, [id_objectif], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

router.put("/kairos/objectif/:id", (req, res) => {
  const id_objectif = req.params.id;
  const { etat } = req.body;
  const sql_update_objectif =
    "UPDATE objectif SET etat=$1 WHERE id_objectif = $2";
  DB.query(sql_update_objectif, [etat, id_objectif], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router
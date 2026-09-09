const express = require('express');
const router = express.Router();
const DB = require("../../config/db");

router.post("/semaine", (req, res) => {
  const { date } = req.body;
  const id_user = req.user.id_user
  const sql_insert_semaine =
    "INSERT INTO semaine(date,id_user) VALUES($1,$2) RETURNING id_semaine";
  DB.query(sql_insert_semaine, [date,id_user], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/semaine", (req, res) => {
    const id_user = req.user.id_user
  const sql_get_semaine = "SELECT * FROM semaine WHERE id_user=$1 ORDER BY date ASC";
  DB.query(sql_get_semaine, [id_user], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});

router.delete("/semaine/:id", (req, res) => {
  const id_semaine = req.params.id;
  const sql_del_semaine =
    "DELETE FROM semaine WHERE id_semaine = $1 RETURNING id_semaine";
  DB.query(sql_del_semaine, [id_semaine], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      const sql_del_ass = "DELETE FROM assignation WHERE id_semaine=$1";
      DB.query(sql_del_ass, [result.rows[0].id_semaine], (err, result) => {
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
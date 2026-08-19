//Setup basique du serveur Express
const port = 3000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json())
const { Client } = require("pg");

const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const DB = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "e",
  database: "kairos",
});

app.use(cors(corsOptions));

try {
  DB.connect();
} catch (err) {
  console.error("Erreur connexion DB", err);
}

app.post("/kairos/type", (req, res) => {
  const { libelle } = req.body;
  const sql_insert_type = "INSERT INTO type(libelle) VALUES($1) RETURNING id_type";
  DB.query(sql_insert_type, [libelle], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});
app.get("/kairos/type", (req, res) => {
  const sql_get_type = "SELECT * FROM type";
  DB.query(sql_get_type, [], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    } 
  });
});
app.delete("/kairos/type/:id", (req, res) => {
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
 
app.get("/kairos/objectif", (req, res) => {
  const sql_get_objectif = "SELECT * FROM objectif";
  DB.query(sql_get_objectif, [], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/kairos/objectif', (req, res) => {
  let { libelle, type } = req.body; 
  const sql_insert_objectif = "INSERT INTO objectif(type,libelle,etat) VALUES($1,$2,$3) RETURNING id_objectif";
  DB.query(sql_insert_objectif, [type, libelle,"en_attente"], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});


app.delete("/kairos/objectif/:id", (req, res) => {
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

app.put("/kairos/objectif/:id", (req, res) => { 
  const id_objectif = req.params.id;
  const {etat} = req.body
  const sql_update_objectif = "UPDATE objectif SET etat=$1 WHERE id_objectif = $2";
  DB.query(sql_update_objectif, [etat,id_objectif], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post("/kairos/tache", (req, res) => {
  const { libelle } = req.body;
  const sql_insert_tache = "INSERT INTO tache(libelle) VALUES($1) RETURNING id_tache";
  DB.query(sql_insert_tache, [libelle], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});
app.get("/kairos/tache", (req, res) => {
  const sql_get_tache = "SELECT * FROM tache";
  DB.query(sql_get_tache, [], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows);
    }
  });
});
app.delete("/kairos/tache/:id", (req, res) => {
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

app.post("/kairos/semaine", (req, res) => {
  const { date } = req.body;
  const sql_insert_semaine = "INSERT INTO semaine(date) VALUES($1) RETURNING id_semaine";
  DB.query(sql_insert_semaine, [date], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});

app.put("kairos/semaine", (req, res) => {
  const { id_semaine, note, nbre_taches } = req.body;
  const sql_modif_semaine =
    "UPDATE semaine SET note=$2,nbre_taches=$3 WHERE id_semaine=$4";
  DB.query(
    sql_modif_semaine,
    [note, nbre_taches, id_semaine],
    (err, result) => {
      if (err) {
        console.error("Erreur DB: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    },
  );
});

app.get("/kairos/semaine", (req, res) => {
  const sql_get_semaine = "SELECT * FROM semaine ORDER BY date ASC";
  DB.query(sql_get_semaine, [], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});

app.delete("/kairos/semaine/:id", (req, res) => {
  const id_semaine = req.params.id;
  const sql_del_semaine = "DELETE FROM semaine WHERE id_semaine = $1 RETURNING id_semaine";
  DB.query(sql_del_semaine, [id_semaine], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      const sql_del_ass = "DELETE FROM assignation WHERE id_semaine=$1"
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

app.post("/kairos/assignation", (req, res) => {
  const { libelle, jour, id_semaine, id_tache } = req.body;
  const sql_insert_assing =
    "INSERT INTO assignation(libelle,jour,id_semaine,etat,id_tache) VALUES($1,$2,$3,$4,$5) RETURNING id_ass";
  DB.query(
    sql_insert_assing,
    [libelle, jour, id_semaine, "en_attente",id_tache],
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

app.get("/kairos/assignation", (req, res) => {
  const sql_get_assignation = "SELECT * FROM assignation";
  DB.query(sql_get_assignation, [], (err, result) => {
    if (err) {
      console.error("Erreur DB: ", err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  });
});

app.put("/kairos/assignation/:id", (req, res) => {
  const id_ass = req.params.id
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

app.delete("/kairos/assignation/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});

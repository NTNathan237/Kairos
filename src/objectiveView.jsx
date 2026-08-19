import React, { useEffect, useRef, useState } from 'react'
const API_URL = 'http://localhost:3000'


const Obj = ({ obj, objs, etat_obj, setObjs }) => {

  let [etat, setEtat] = useState(obj.etat || "en_attente");

  const themes_etats = {
    en_attente: "text-black bg-gray-400",
    abandon: "text-[#AD0000] bg-red-300",
    en_cours: "text-main bg-blue-300",
    fait: "text-[#009600] bg-green-300",
  };


  return (
    <div className="bg-[#D3D3D3] w-[95%] left-0 justify-between flex flex-row border-[1px] border-l-0 border-main my-2 py-1 px-5 gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-main text-[18px]">{obj.libelle} </h2>
        <select
          id="select"
          value={etat}
          onChange={(e) => {
            setEtat(e.target.value);
            const id_objectif = obj.id_objectif
            e.target.className = `rounded-full w-[100px] text-[12px] font-semibold `;
            objs = objs.with(objs.findIndex(o => o.id_objectif === id_objectif),
              {
                id_objectif: obj.id_objectif,
                type: obj.type,
                libelle: obj.libelle,
                etat: e.target.value

              }
            )
            fetch(`${API_URL}/kairos/objectif/${id_objectif}`, {
              method: "PUT",
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify({ etat:e.target.value })
            })
            console.log(objs)

          }}
          className={`rounded-full w-[100px] text-[12px] p-0.5 font-semibold ${themes_etats[etat]}`}
        >
          <option value="en_attente">En attente</option>
          <option value="fait">Fait</option>
          <option value="abandon">Abandon</option>
          <option value="en_cours">En cours</option>
        </select>
      </div>
      <div className="flex justify-center items-center  flex-row gap-[10px] ">
        <img src="src/assets/info-circle.svg" alt="info-bulle" />
        <span className="font-bold text-[15px] text-red-500 cursor-pointer" onClick={() => {
          if (confirm("Supprimer cet objectif ?")) {
            const id_objectif = obj.id_objectif
            fetch(`${API_URL}/kairos/objectif/${id_objectif}`, {
              method: 'DELETE'
            })
            setObjs(objs.filter(o => o.id_objectif !== id_objectif))
          }
        }}>X</span>
      </div>
    </div>
  );
};


const ObjectiveView = () => {
  let [objs, setObjs] = useState([]);
  let [types, setTypes] = useState([])
  useEffect(() => {
    async function fetchTypes() {
      const res = await fetch(`${API_URL}/kairos/type`, {
        method: 'Get',
      })
      const data = await res.json()
      setTypes(data)
    }
    async function fetchObjs() {
      const res = await fetch(`${API_URL}/kairos/objectif`, {
        method: 'Get',
      })
      const data = await res.json()
      setObjs(data)
    }
    fetchObjs();
    fetchTypes()
  }, []);
  const [ajout, setAjout] = useState(false)
  const [is_obj, setIs_obj] = useState(false)
  let libelle_type_ref = useRef(null)
  return (
    <>
      <div className='w-[445px] bg-white rounded-tr-lg h-[960px] overflow-auto'>
        <div className='sticky top-0 left-0 text-center bg-main py-5'>
          <h2 className='text-white font-bold text-[25px]'>Objectifs</h2>
        </div>
        <div className='flex justify-center wrap gap-6'>

          <button onClick={() => { setAjout(true); setIs_obj(true) }} className='button' >Ajouter un objectif</button>
          <button className='button' onClick={() => { setAjout(true); setIs_obj(false) }}>Ajouter un type</button>
        </div>
        {ajout ?
          <div>
            {is_obj ?
              <>
                <div className='flex flex-col justify-center items-center mt-3 bg-blue-100 rounded-lg border-main p-3'>
                  <input type="text" id='titre' className='bg-white mb-1 border rounded-lg p-2' placeholder="Titre de l'objectif" />
                  <select className='bg-blue-1000 text-main' id="type">
                    {
                      types.map(type => {
                        return <option value={type.libelle}>{type.libelle}</option>
                      })}

                  </select>
                  <div className='flex flex-row gap-5'>
                    <button className='button bg-green-800' onClick={() => {
                      const libelle = document.getElementById('titre').value;
                      const type = document.getElementById('type').value;

                      if (libelle && type) {
                        const ajout_objectif = async () => {
                          const res = await fetch(`${API_URL}/kairos/objectif`, {
                            method: 'POST',
                            headers: {
                              'Content-type': 'application/json',
                            },
                            body: JSON.stringify({ libelle, type })
                          });
                          const data = await res.json()
                          setObjs([
                            ...objs,
                            {
                              id_objectif: data.rows[0].id_objectif,
                              libelle,
                              type
                            }
                          ])
                        }
                        try {
                          ajout_objectif();
                          alert("Ajout reussi");
                          setAjout(false)
                        } catch (err) {
                          console.error(err)
                          alert("Ajout echoué")
                        }

                      } else {
                        alert('Valeur(s) manquant(es)')
                      }
                    }}>Ajouter</button>
                    <button className='button bg-red-800' onClick={() => setAjout(false)}>Annuler</button>
                  </div>

                </div>
              </>
              :
              <>
                <div className='flex flex-col justify-center items-center mt-3 bg-blue-100 rounded-lg border-main p-3'>
                  <input type="text" ref={libelle_type_ref} id='titre' className='bg-white mb-1 border-[1px] rounded-lg p-2' placeholder="Libelle" />
                  <div className='flex flex-row gap-5'>
                    <button className='button bg-green-800' onClick={() => {
                      const libelle = libelle_type_ref.current.value;
                      if (libelle) {
                        const ajout_type = async () => {
                          const res = await fetch(`${API_URL}/kairos/type`, {
                            method: 'POST',
                            headers: {
                              'Content-type': 'application/json',
                            },
                            body: JSON.stringify({ libelle })
                          });
                          const data = await res.json()
                          setTypes([
                            ...types,
                            {
                              id_type: data.rows[0].id_type,
                              libelle,
                            }
                          ])
                        }
                        try {
                          ajout_type();
                          alert("Ajout reussi");
                          setAjout(false)
                        } catch (err) {
                          console.error(err)
                          alert("Ajout echoué")
                        }
                      } else {
                        alert('Valeur manquante')
                      }
                    }}>Ajouter</button>
                    <button className='button bg-red-800' onClick={() => setAjout(false)}>Annuler</button>
                  </div>
                </div>
              </>
            }

          </div> : null}
        <div>
          {
            types.map(type => {

              return (
                <>
                  <h3 className='text-main pt-5 pb-3 text-center text-[20px] font-bold flex flex-row gap-4 justify-center'><span>{type.libelle}</span>
                    <span className='font-bold text-red-500 cursor-pointer'
                      onClick={() => {
                        if (confirm("Cette action va supprimer toutes les taches concernées")) {
                          const id_type = type.id_type
                          fetch(`${API_URL}/kairos/type/${id_type}`, {
                            method: 'DELETE'
                          })
                          setTypes(types.filter(type => type.id_type !== id_type))
                          setObjs(objs.filter(obj => obj.libelle !== type.libelle))
                        } else {
                          return
                        }
                      }}>X</span>
                  </h3>
                  {objs.map(obj => {
                    if (type.libelle == obj.type) {
                      return <Obj setObjs={setObjs} objs={objs} key={obj.id_objectif} obj={obj} />
                    }

                  })}
                </>
              )
            })
          }

        </div>

      </div >
    </>
  )
}

export default ObjectiveView
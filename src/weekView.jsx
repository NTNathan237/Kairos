import { useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
const API_URL = 'http://localhost:3000'
const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

function formatter_date_sql(dateSQL) {
  const d = new Date(dateSQL);
  return d.toLocaleDateString()
}

const Task = ({ etat_tache, libelle, id }) => {
  let [etat, setEtat] = useState(etat_tache || 'en_attente');

  const themes_etats = {
    en_attente: "text-main bg-blue-300",
    echec: "text-[#AD0000] bg-red-300",
    fait: "text-[#009600] bg-green-300",
  };
  return (
    <div className='task' id={id}>

      <span className='text-[12px] font-semibold'>{libelle}</span>
      <select
        id="select"
        value={etat}
        onChange={(e) => {
          setEtat(e.target.value);
          e.target.className = `rounded-full w-[40px] text-[8px] font-semibold ${themes_etats[e.target.value]}`;
        }}
        className={`rounded-full w-[40px] text-[8px] font-semibold ${themes_etats[etat]}`}
      >
        <option value="en_attente">En attente</option>
        <option value="fait">Fait</option>
        <option value="echec">Echec</option>
      </select>
      <button className='text-red-600 cursor-pointer'>X</button>

    </div>
  )
}

const JourCell = ({ jour, id_semaine, assignations }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${jour}-${id_semaine}`,
    data: { jour, id_semaine },
  })

  return (
    <div ref={setNodeRef} className={`week_cel ${isOver ? 'bg-blue-100' : ''}`}>
      {assignations
        .filter(a => a.jour === jour && a.id_semaine === id_semaine)
        .map(a => <Task key={a.id} id={a.id} libelle={a.libelle} etat_tache={a.etat} />)}
    </div>
  )
}

const WeekRow = ({ assignations, infos_semaine, semaines, setSemaines }) => {
  return (
    <div className='week-row'>
      <div className='week_cel flex flex-col justify-evenly'>
        <h3 className='font-semibold'>{infos_semaine.date}</h3>
        {
          infos_semaine.note < infos_semaine.nbre_taches / 2 ?
            <h3 className='font-semibold text-blue-950'><span className='text-red-500'>{infos_semaine.note}</span>/{infos_semaine.nbre_taches}</h3>

            : infos_semaine.note >= infos_semaine.nbre_taches / 2 && infos_semaine.note < (infos_semaine.nbre_taches * 3) / 4 ?
              <h3 className='font-semibold text-blue-950'><span className='text-amber-500'>{infos_semaine.note}</span>/{infos_semaine.nbre_taches}</h3>
              :
              <h3 className='font-semibold text-blue-950'><span className='text-green-700'>{infos_semaine.note}</span>/{infos_semaine.nbre_taches}</h3>

        }
        <button className='button bg-red-700 p-[1px]' onClick={() => {
          const id_semaine = infos_semaine.id_semaine

          const supprimer_semaine = async () => {
            const res = await fetch(`${API_URL}/kairos/semaine/${id_semaine}`, {
              method: 'DELETE',
            });

            setSemaines(semaines.filter(semaine => semaine.id_semaine !== id_semaine))
          }
          try {
            supprimer_semaine();
            alert("Supression reussie");
          } catch (err) {
            console.error(err)
            alert("Supression echoué")
          }

        }}>Supprimer</button>
      </div>
      {jours.map(jour => (
        <JourCell
          key={jour}
          jour={jour}
          id_semaine={infos_semaine.id_semaine}
          assignations={assignations}
        />
      ))}
    </div>
  )
}

const WeekView = ({assignations,setAss}) => {
  
  let [semaines, setSemaines] = useState([
    { id_semaine: 1, date: '08/07/2026', note: 27, nbre_taches: 29 },
    { id_semaine: 3, date: '09/07/2026', note: 15, nbre_taches: 26 },
    { id_semaine: 2, date: '90/07/2026', note: 10, nbre_taches: 24 },
  ])
  useEffect(() => {

    async function fetchSemaines() {
      const res = await fetch(`${API_URL}/kairos/semaine`, {
        method: 'Get',
      })
      const data = await res.json()
      console.log(data)
      if (data) {
        setSemaines([
          ...semaines,
          ...data.map(semaine => {
            return {
              id_semaine: semaine.id_semaine,
              date: formatter_date_sql(semaine.date),
              note: semaine.note,
              nbre_taches: semaine.nbre_taches
            }
          }),
        ])
      }

    }
    fetchSemaines()
  }, [])
  let dateRef = useRef(null)

  let [ajout_semaine, setAjout_semaine] = useState(false)
  return (
    <div className='w-[1257px] h-[940px] rounded-t-lg bg-white overflow-auto flex flex-col justify-start items-space-envely'>
      <div className='grid grid-cols-8 gap-0 justify-center top-0 left-0 sticky'>
        <div className='head_cel rounded-tl-lg'>Semaine</div>
        <div className='head_cel'>Lundi</div>
        <div className='head_cel'>Mardi</div>
        <div className='head_cel'>Mercredi</div>
        <div className='head_cel'>Jeudi</div>
        <div className='head_cel'>Vendredi</div>
        <div className='head_cel'>Samedi</div>
        <div className='head_cel rounded-tr-lg'>Dimanche</div>
      </div>
      {semaines.map(semaine => (
        <WeekRow key={semaine.id_semaine} assignations={assignations} infos_semaine={semaine} semaines={semaines} setSemaines={setSemaines} />
      ))}
      <div className='flex justify-center items-center week-row'>
        <button className='button bg-green-800' onClick={() => setAjout_semaine(true)}>Ajouter une semaine</button>
      </div>
      {ajout_semaine ?
        <div className='flex flex-col justify-center items-center mt-3 bg-blue-100 rounded-lg border-main p-3'>
          <h3 className='text-main font-bold'>Date de debut de la semaine:</h3>
          <input type="date" ref={dateRef} id='titre' className='bg-white mb-1 border-[1px] rounded-lg p-2' />
          <div className='flex flex-row gap-5'>
            <button className='button bg-green-800' onClick={() => {
              const date = dateRef.current.value;
              let date_locale = new Date(date);

              date_locale = date_locale.toLocaleDateString()
              console.log(date_locale)


              if (date) {
                const ajout_semaine = async () => {
                  const res = await fetch(`${API_URL}/kairos/semaine`, {
                    method: 'POST',
                    headers: {
                      'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ date })
                  });
                  const data = await res.json()
                  console.log(data.rows[0])
                  setSemaines([
                    ...semaines,
                    {
                      id_semaine: data.rows[0].id_semaine,
                      date: date_locale,
                      note: 0,
                      nbre_taches: 0,
                    }
                  ])
                }
                try {
                  ajout_semaine();
                  alert("Ajout reussi");
                  setAjout_semaine(false)
                } catch (err) {
                  console.error(err)
                  alert("Ajout echoué")
                }
              } else {
                alert('Valeur manquante')
              }
            }}>Ajouter</button>
            <button className='button bg-red-800' onClick={() => setAjout_semaine(false)}>Annuler</button>
          </div>
        </div>
        : null}
    </div>
  )
}

export default WeekView
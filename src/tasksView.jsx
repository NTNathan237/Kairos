import React, { useEffect, useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core';
const API_URL = 'http://localhost:3000'

const Types = ['Dev Perso', 'Obligations', 'Business', 'Apprentissage']

const TacheItem = ({ tache, setTaches, taches }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `tache-${tache.id_tache}`,
    data: { tache },
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined

  return (
    <div className='flex flex-row gap-1 justify-between items-center bg-gray-100 border-main w-[90%] h-auto rounded-lg border-2 py-1 px-2'>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className='bg-main z-50 text-white rounded-lg cursor-grab active:cursor-grabbing bg-gray-100 rounded p-1.5'
      >
        <span className='text-[13px] font-semibold'>{tache.libelle}</span>
      </div>
      <div className='flex flex-row justify-center gap-2'>
        <span className='text-red-600 hover:cursor-pointer text-[16px] font-bold' onClick={() => {
          if (confirm("Supprimer cette tache ?")) {
            const id_tache = tache.id_tache
            fetch(`${API_URL}/kairos/tache/${id_tache}`, {
              method: 'DELETE'
            })
            setTaches(taches.filter(t => t.id_tache !== id_tache))
          }
        }}>X</span>
      </div>

    </div>
  )
}

const TasksView = ({ taches, setTaches }) => {
  useEffect(() => {
    async function fetchTaches() {
      const res = await fetch(`${API_URL}/kairos/tache`, {
        method: 'Get',
      })
      const data = await res.json()
      setTaches([
        ...taches,
        ...data])
    }
    fetchTaches()
  }, [])

  let [ajout, setAjout] = useState(false)
  let tacheRef = useRef(null)
  let type_tacheRef = useRef(null)

  return (
    <div className='w-[210px] h-[960px] bg-white rounded-tl-lg overflow-auto'>
      <div className='top-0 left-0 text-center bg-main py-5'>
        <h2 className='text-white font-bold text-[25px]'>Taches</h2>
      </div>
      <div className='flex justify-center'>
        <button className='button' onClick={() => {
          setAjout(true)
        }}>Ajouter une tache</button>
      </div>
      {ajout ?
        <div className='flex flex-col justify-center items-center mt-3 bg-blue-100 rounded-lg border-main p-3 m-0.5 w-[100%]'>
          <input type="text" ref={tacheRef} className='bg-white mb-1 border-[1px] rounded-lg p-1 w-[120px]' placeholder="Libelle" />
          <select className='bg-blue-1000 text-main' ref={type_tacheRef}>
            {Types.map(type => {
              return <option value={type}>{type}</option>
            })}
          </select>
          <div className='flex flex-row gap-3'>
            <button className='button bg-green-800 p-1' onClick={() => {
              const libelle = tacheRef.current.value;
              const type = type_tacheRef.current.value;
              if (libelle) {
                const ajout_tache = async () => {
                  const res = await fetch(`${API_URL}/kairos/tache`, {
                    method: 'POST',
                    headers: {
                      'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ libelle, type })
                  });
                  const data = await res.json()
                  setTaches([
                    ...taches,
                    {
                      id_tache: data.rows[0].id_tache,
                      type,
                      libelle,
                    }
                  ])
                }
                try {
                  ajout_tache();
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
            <button className='button bg-red-800 p-1' onClick={() => setAjout(false)}>Annuler</button>
          </div>
        </div>
        : null
      }

      <div className='flex flex-col p-3 gap-1 justify-center items-center'>
        {Types.map(T => {
          return (
            <>
              <h3 className='text-main pt-3 pb-1 text-center text-[15px]  font-bold flex flex-row gap-4 justify-center'>{T}</h3>
              {taches.map(t => {
                if (t.type == T) {
                  return <TacheItem key={t.id_tache} tache={t} taches={taches} setTaches={setTaches} />
                }
              }
              )}
            </>
          )
        })
        }
      </div>
    </div>
  )
}

export default TasksView
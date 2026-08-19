import React, { useEffect, useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core';
const API_URL = 'http://localhost:3000'

const TacheItem = ({ tache, setTaches,taches }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `tache-${tache.id_tache}`,
    data: { tache },
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined

  return (
    <div className='flex flex-col items-center bg-gray-200 border-main rounded-lg border-2  p-3'>
      <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className='task cursor-grab active:cursor-grabbing bg-gray-100 rounded p-2 mb-2'
    >
      <span className='text-[13px] font-semibold'>{tache.libelle}</span>
    </div>
    <div className='flex flex-row justify-center gap-3'>
      <img src="src/assets/info-circle.svg" alt="info-bulle" />
      <span className='text-red-600 hover:cursor-pointer text-[14px] font-bold' onClick={()=>{
        if (confirm("Supprimer cette tache ?")) {
            const id_tache = tache.id_tache
            fetch(`${API_URL}/kairos/tache/${id_tache}`, {
              method: 'DELETE'
            })
            setTaches(taches.filter(t =>  t.id_tache!== id_tache))
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
  let tacheRef= useRef(null)

  return (
    <div className='w-[210px] h-[960px] bg-white rounded-tl-lg overflow-auto'>
      <div className='sticky top-0 left-0 text-center bg-main py-5'>
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
          <div className='flex flex-row gap-5'>
            <button className='button bg-green-800 p-1' onClick={() => {
              const libelle = tacheRef.current.value;
              if (libelle) {
                const ajout_tache = async () => {
                  const res = await fetch(`${API_URL}/kairos/tache`, {
                    method: 'POST',
                    headers: {
                      'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ libelle })
                  });
                  const data = await res.json()
                  setTaches([
                    ...taches,
                    {
                      id_tache: data.rows[0].id_tache,
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

      <div className='flex flex-col p-3 gap-2'>
        {taches.map(t => <TacheItem key={t.id_tache} tache={t} taches={taches} setTaches={setTaches}/>)}
      </div>
    </div>
  )
}

export default TasksView
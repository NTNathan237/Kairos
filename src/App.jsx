// App.jsx
import React, { useEffect, useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import ObjectiveView from './objectiveView'
import WeekView from './weekView'
import TasksView from './tasksView'
const API_URL = 'http://localhost:3000'



const App = () => {
  const [taches, setTaches] = useState([])
  const [assignations, setAssignations] = useState([])

  useEffect(() => {
    async function fetchAss() {
      const res = await fetch(`${API_URL}/kairos/assignation`, {
        method: 'Get',
      })
      const data = await res.json()
      setAssignations(data)
    }
    fetchAss();
  }, [])

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const tache = active.data.current.tache
    const { jour, id_semaine } = over.data.current

    async function ajout_ass() {
      const res = await fetch(`${API_URL}/kairos/assignation`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ libelle: tache.libelle, jour, id_semaine, id_tache: tache.id_tache })
      })
      const data = await res.json()
      setAssignations([
        ...assignations,
        {
          id_ass: data.rows[0].id_ass,
          id_tache: tache.id_tache,
          libelle: tache.libelle,
          jour,
          id_semaine,
          etat: "en_attente"
        }
      ])
    }
    ajout_ass();
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <>

        <header className='flex justify-around flex-row  items-center h-[80px] bg-white-500 text-lg top-0 bg-white mb-5'>
          <h1 className='text-main font-extrabold text-[40px]'>Kairos</h1>
          <h2 className='text-main font-bold'>Bienvenue</h2>
        </header>

        <main className='bg-gray-300 pt-5 flex flex-row gap-[20px] justify-center items-end'>
          <ObjectiveView />
          <WeekView assignations={assignations} setAss={setAssignations} />
          <TasksView taches={taches} setTaches={setTaches} />
        </main>

        <footer className='bg-main flex flex-row justify-around p-5 text-white'>
          <p className='font-bold'>Fait par GGX</p>
          <p className='font-bold'>Tout droits resevés</p>
        </footer>

      </>
    </DndContext>
  )
}

export default App
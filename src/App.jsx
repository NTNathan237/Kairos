// App.jsx
import React, { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import ObjectiveView from './objectiveView'
import WeekView from './weekView'
import TasksView from './tasksView'

const tachesInitiales = [
  { id_tache: 1, libelle: 'Tache 1' },
  { id_tache: 2, libelle: 'Tache 2' },
  { id_tache: 3, libelle: 'Tâche 3' },
  { id_tache: 4, libelle: 'Tâche 4' },
  { id_tache: 5, libelle: 'Tâche 5' },
]

const semaines = [
  { id_semaine: 1, date: '08/07/2026', note: 27, nbre_taches: 29 },
  { id_semaine: 3, date: '09/07/2026', note: 15, nbre_taches: 26 },
  { id_semaine: 2, date: '10/07/2026', note: 10, nbre_taches: 24 },
]

const App = () => {
  const [taches, setTaches] = useState(tachesInitiales) 
  const [assignations, setAssignations] = useState([]) 

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const tache = active.data.current.tache
    const { jour, id_semaine } = over.data.current

    setAssignations(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        tache_id: tache.id,
        libelle: tache.libelle, 
        jour,
        id_semaine,
        etat: 'en_attente',
      },
    ])
    
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <> 

        <header className='flex justify-around flex-row  items-center h-[80px] bg-white-500 text-lg p-5 top-0 bg-white mb-5'>
          <h1 className='text-main font-extrabold text-[40px] animate-bounce'>Kairos</h1>
          <h2 className='text-main font-bold'>Bienvenue GGX</h2>
        </header>

        <main className='bg-gray-300 pt-5 flex flex-row gap-[20px] justify-center items-end'>
          <ObjectiveView />
          <WeekView semaines={semaines} assignations={assignations} />
          <TasksView taches={taches} setTaches={setTaches} />
        </main>

        <footer className='bg-blue-600 flex flex-row justify-around p-5 text-white'>
          <p className='text-bold btn'>Fait par GGX</p>
          <p className='text-bold'>Tout droits resevés</p>
        </footer>

      </>
    </DndContext>
  )
}

export default App
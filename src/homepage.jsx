import React from 'react'
import { Link } from 'react-router-dom'


const HomePage = () => {
    return (
        <>
            <Link to={'/logIn'}>S'inscrire</Link>
            <Link to={'/signIn'}>Se connecter</Link>
            <div>HomePage</div>
        </>
    )
}

export default HomePage
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './homepage'
import NotFound from './notFound'
import LogIn from './login'
import SignIn from './signIn'

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/dashboard", element: <App /> },
  { path: "/logIn", element: <LogIn /> },
  { path: "/signIn", element: <SignIn /> },
  { path: "*", element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

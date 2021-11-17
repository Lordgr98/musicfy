import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import firebase from './utils/Firebase'
import 'firebase/auth'
import Auth from './pages/Auth'
import LoggedLayout from './layouts/loggedLayout'

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reloadApp, setReloadApp] = useState(false)

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut()
      setUser(null)
    } else {
      setUser(currentUser)
    }
    setIsLoading(false)

    // if (!currentUser) {
    //   setUser(false)
    // } else {
    //   setUser(currentUser)
    // }
    // setIsLoading(false)
  })

  if (isLoading) {
    return null
  }

  return (
    <>
      {!user ? (
        <Auth />
      ) : (
        <LoggedLayout user={user} setReloadApp={setReloadApp} />
      )}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App

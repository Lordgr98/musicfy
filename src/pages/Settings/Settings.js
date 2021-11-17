import React, { useState } from 'react'
import UploadAvatar from '../../components/Settings/UploadAvatar'
import BasicModal from '../../components/Modal/BasicModal'
import UserName from '../../components/Settings/UserName'
import UserEmail from '../../components/Settings/UserEmail'
import UserPassword from '../../components/Settings/UserPassword'

import './Settings.scss'

export default function Settings(props) {
  const { user, setReloadApp } = props
  const [showModal, setShowModal] = useState(false)
  const [titleModal, setTitleModal] = useState('')
  const [contenModal, setContenModal] = useState(null)

  return (
    <div className='settings'>
      <h1>Settings</h1>
      <div className='avatar-name'>
        <UploadAvatar user={user} setReloadApp={setReloadApp} />
        <UserName
          user={user}
          setShowModal={setShowModal}
          setTitleModal={setTitleModal}
          setContentModal={setContenModal}
          setReloadApp={setReloadApp}
        />
      </div>
      <UserEmail
        user={user}
        setShowModal={setShowModal}
        setTitleModal={setTitleModal}
        setContentModal={setContenModal}
      />
      <UserPassword
        setShowModal={setShowModal}
        setTitleModal={setTitleModal}
        setContentModal={setContenModal}
      />
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contenModal}
      </BasicModal>
    </div>
  )
}

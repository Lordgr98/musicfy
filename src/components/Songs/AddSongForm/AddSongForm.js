import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Icon, Modal, Dropdown } from 'semantic-ui-react'
import firebase from '../../../utils/Firebase'
import { map } from 'lodash'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import 'firebase/firestore'
import 'firebase/storage'
import './AddSongForm.scss'

const db = firebase.firestore(firebase)

export default function AddSongForm(props) {
  const { setShowModal } = props
  const [formData, setFormData] = useState(initialValueForm())
  const [albums, setAlbums] = useState([])
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    db.collection('albums')
      .get()
      .then((response) => {
        const albumsArray = []
        map(response?.docs, (album) => {
          const data = album.data()
          albumsArray.push({
            key: album.id,
            value: album.id,
            text: data.name,
          })
        })
        setAlbums(albumsArray)
      })
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    setFile(file)
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.mp3',
    noKeyboard: true,
    onDrop,
  })
  const uploadSong = (fileName) => {
    const ref = firebase.storage().ref().child(`song/${fileName}`)

    return ref.put(file)
  }

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warning(
        'El nombre de la cancion y el album al que pertenencen son obligatorios'
      )
    } else if (!file) {
      toast.warning('La cancion es obligatoria')
    } else {
      setIsLoading(true)
      const fileName = uuidv4()
      uploadSong(fileName)
        .then(() => {
          db.collection('songs')
            .add({
              name: formData.name,
              album: formData.album,
              fileName: fileName,
            })
            .then(() => {
              toast.success('Cancion subida')
              resetForm()
              setIsLoading(false)
              setShowModal(false)
            })
            .catch(() => {
              toast.error('Error al subir la cancion')
              setIsLoading(false)
            })
        })
        .catch(() => {
          toast.error('Error al subir la cancion')
          setIsLoading(false)
        })
    }
  }
  const resetForm = () => {
    setFormData(initialValueForm())
    setFile(null)
    setAlbums([])
  }
  return (
    <Form className='add-song-form' onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder='Nombre de la cancion'
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder='Asigna la cancion a un álbum'
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className='song-upload' {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name='cloud upload' className={file && 'load'} />
          <div>
            <p>
              Arrastra tu cancion o haz click <span>aqui</span>.
            </p>
            {file && (
              <p>
                Cancion subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type='submit' loading={isLoading}>
        {' '}
        Subir cancion
      </Button>
    </Form>
  )
}
function initialValueForm() {
  return {
    name: '',
    album: '',
  }
}

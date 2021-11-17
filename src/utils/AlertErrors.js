import { toast } from 'react-toastify'

export default function alertErrors(type) {
  switch (type) {
    case 'auth/wrong-password':
      toast.warning('La contraseña es invalida')
      break
    case 'auth/email-already-in-use':
      toast.warning('El nuevo email ya esta en uso')
      break

    default:
      toast.warning('Error del servidor, intentelo más tarde')
      break
  }
}

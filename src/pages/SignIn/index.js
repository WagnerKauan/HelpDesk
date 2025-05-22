import './SignIn.css'
import logo from '../../assets/img/logo.png'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/Auth'
import schemaSignIn from '../../schemas/schemaSignIn.js'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaArrowLeftLong } from 'react-icons/fa6'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleSignIn(e) {
    e.preventDefault()

    const result = schemaSignIn.safeParse({ email, password })

    if (!result.success) {
      result.error.errors.forEach(err => toast.error(err.message))
      return
    }

    await signIn(email, password)

    setEmail('')
    setPassword('')
  }

  return (
    // Fade-in da tela toda com duração de 0.6s
    <motion.div
      className='container-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      <div className='login'>
        <Link className='goHome' to="/" >
          <FaArrowLeftLong size={20} color='#1d4db6' />
        </Link>
        <div className='login-area'>
          <img src={logo} alt='Logo do sistema de chamados' />
        </div>

        {/* Slide up do form */}
        <motion.form
          onSubmit={handleSignIn}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1>Entrar</h1>
          <input value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='seu@email.com' />
          <input value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder='********' />

          {/* Botão com pulse enquanto carrega */}
          <motion.button
            type='submit'
            animate={loadingAuth ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={loadingAuth ? { repeat: Infinity, duration: 0.8 } : { duration: 0 }}
          >
            {loadingAuth ? 'carregando...' : 'Acessar'}
          </motion.button>
        </motion.form>

        <Link to='/register'>Criar uma conta</Link>
      </div>
    </motion.div>
  )
}

export default SignIn

import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import schemaSignUp from '../../schemas/schemaSignUp.js'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/Auth.js'
import { motion } from 'framer-motion'  // importação power

import '../SignIn/SignIn.css'
import logo from '../../assets/img/logo.png'


const SignUp = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signUp, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault()

    const result = schemaSignUp.safeParse({ nome, email, password }) 

    if(!result.success){
      result.error.errors.forEach(err => toast.error(err.message))
      return
    }

    await signUp(nome, email, password)

    setNome('')
    setEmail('')
    setPassword('')
  }

  return (
    <motion.div
      className='container-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Logo do sistema de chamados' />
        </div>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1>Registrar</h1>
          <input value={nome} onChange={e => setNome(e.target.value)} type='text' placeholder='nome' />
          <input value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='seu@email.com' />
          <input value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder='********' />

          <motion.button
            type='submit'
            animate={loadingAuth ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={loadingAuth ? { repeat: Infinity, duration: 0.8 } : { duration: 0 }}
          >
            {loadingAuth ? 'Carregando...' : 'Cadastrar'}
          </motion.button>
        </motion.form>

        <Link to='/'>Já possui uma conta? faça login.</Link>
      </div>
    </motion.div>
  )
}

export default SignUp

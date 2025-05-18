import { useContext } from 'react'
import { AuthContext } from "../../contexts/Auth"
import avatarImg from '../../assets/img/avatar.png'
import { Link } from 'react-router-dom'
import { FiHome, FiSettings, FiUser } from 'react-icons/fi'
import './header.css'

function Header(){

  const { user } = useContext(AuthContext)

  return(
    <header className="sidebar">
      
      <div>
        <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
      </div>

      <Link to='/dashboard'>
        <FiHome color='#FFF' size={24} />
        Chamados
      </Link> 
      
      <Link to='/customers'>
        <FiUser color='#FFF' size={24} />
        Clientes
      </Link>

      <Link to='/profile'>
        <FiSettings color='#FFF' size={24} />
        Perfil
      </Link>
    </header>
  )
}

export default Header
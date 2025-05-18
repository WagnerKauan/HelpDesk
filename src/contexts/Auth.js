import { createContext, useEffect, useState } from "react";
import { auth, db } from '../services/firebaseConnection.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({})

function AuthProvier({ children }) {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  const firebaseErrors = {
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/email-already-in-use' : 'Este e-mail já está em uso.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
  }

  // Toda vez que entrar na aplicacao eu verifico se tem algum usuário salvo no localStorage e passo pra setUser para manter sempre o usuário logado
  useEffect(() => {

    async function loadUser() {
      const storageUser = localStorage.getItem('@ticketsPRO')

      if(storageUser){
        // se tem algum usuário salvo no localStorage eu pego os dados e passo pro state que espalha os dados na aplicacao
        setUser(JSON.parse(storageUser))
        setLoading(false)
      }

      setLoading(false)
    }

    loadUser()
  }, [])


  // logando usuário na aplicacao
  async function signIn(email, password) {
    setLoadingAuth(true)

    await signInWithEmailAndPassword(auth, email, password) // funcao para fazer login no firebase-auth
      .then(async (value) => { // se der certo o login ele me retorna os dados do usuário em (value)
        let uid = value.user.uid // pegando id do usuário

        const docRef = doc(db, "users", uid) // referencia da colecao "users" e o nome do documento "uid"
        const docSnap = await getDoc(docRef) // pegando os dados Como nome e foto do perfil do banco de dados

        // passando os dados que eu quero espalhar para a aplicacao em um objeto
        let data = {
          uid: uid,
          nome: docSnap.data().nome,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl,
        }

        setUser(data) // setando os dados que eu quero espalhar para a aplicacao
        storageUser(data) // passando os dados pra funcao que salva no localStorage
        setLoadingAuth(false)
        toast.success('Seja bem-vindo(a) de volta..')
        navigate('/dashboard')
      })
      .catch(err => {
        console.log(err)
        setLoadingAuth(false)

        console.log(err.code)

        const message = firebaseErrors[err.code] || 'Erro ao tentar fazer login. Tente novamente.'
        toast.error(message)
      })
  }


  // criado novo usuário 
  async function signUp(nome, email, password) {
    setLoadingAuth(true)

    await createUserWithEmailAndPassword(auth, email, password) // metodo para criar um novo usuario
      .then(async (value) => { // no value eu recebo uma promise com os dados do usuário cadastrado
        let uid = value.user.uid // pegando o uid do usuário cadastrado

        await setDoc(doc(db, "users", uid), { // criando um novo documento no banco de dados nome da colecao "users" e o nome do documento é o uid do usuário
          nome: nome, // passando o nome cadastrado
          avatarUrl: null, // falando que não a foto de perfil

        }).then(() => {

          let data = { // se criou certinho a colecao eu pego os dados que eu quero espalhar para a aplicacao
            uid: uid,
            nome: nome,
            email: value.user.email,
            avatarUrl: null,
          }

          setUser(data) // setando os dados que eu quero espalhar para a aplicacao
          storageUser(data) // passando os dados pra funcao que salva no localStorage
          setLoadingAuth(false)
          toast.success('Seja bem-vindo(a) ao sistema.')
          navigate('/dashboard')

        })
      })
      .catch((err) => {
        console.log(err)
        setLoadingAuth(false)

        const message = firebaseErrors[err.code] || 'Erro ao registrar. Tente novamente.'
        toast.error(message)
      })
  }

  function storageUser(data) {
    //além de já espalhar os dados na aplicacao eu também salvo eles no localStorage
    localStorage.setItem('@ticketsPRO', JSON.stringify(data))
  }

  //saindo da aplicacao
  async function logout() {
    await signOut(auth) // funcao do firebase-auth para deslogar um usuário
    localStorage.removeItem('@ticketsPRO') // removendo os dados do usuário do localStorage
    setUser(null) // voltando a state que tem um obj com os dados do usuário de volta pra "null"
  }

  return (
    <AuthContext.Provider // espalhando os dados do usuario na aplicacao 
      value={{
        signed: !!user, // transformando o valor de user em boolean para verificar se o usuário esta logado
        user, // objeto que tem os dados do usuario 
        signIn, // funcao para logar
        signUp, // funcao para registrar
        logout, // funcao para sair da aplicacao
        loadingAuth,
        loading,
        storageUser,
        setUser
      }}>

      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvier
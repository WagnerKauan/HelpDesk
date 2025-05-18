import Header from '../../components/Header'
import Title from '../../components/Title'
import avatarImg from '../../assets/img/avatar.png'
import { FiSettings, FiUpload } from 'react-icons/fi'
import { AuthContext } from '../../contexts/Auth'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import './profile.css'


export default function Profile() {

  const { user, storageUser, setUser, logout } = useContext(AuthContext)
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [imageAvatar, setImageAvatar] = useState(null)
  const [nome, setNome] = useState(user && user.nome)
  const [email, setEmail] = useState(user && user.email)


  //Funcao para trocar a foto de perfil no front end dentro do input
  async function handleFile(e) {
    //recebendo a foto pelo evento (e) e adicionando ela em uma constante (image)
    if(e.target.files[0]){ 
      const image = e.target.files[0]
      
      //Verificando os formatos das imagens se é jpeg ou png só vai aceitar esses formatos
      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image) // adicionando a nova foto na aplicacao
        setAvatarUrl(URL.createObjectURL(image)) //Mostrando a foto no front 
      
      }else{
        toast.error('Envie imagem do tipo PNG ou JPEG.')
        setImageAvatar(null)
        return
      }
    }

  }

  async function handleUpload() {
    const currentUid = user.uid
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`) // referencia da foto do usuário

    const uploadTask = uploadBytes(uploadRef, imageAvatar) //Enviado a foto para o firebase-storage retorna uma promise
      .then((snapshot) => { // ele retorna um snapshot com dados da foto salva

        getDownloadURL(snapshot.ref) // metodo usado para pegar a url da imagem do usuário que retorna em uma promise
          .then(async (downloadUrl) => { // esse parametro retorna a url da foto do usuário
            let urlFoto = downloadUrl // salvando a url da foto do usuário em uma variavel

            // essa parte é pra salvar a url da foto do usuário no firebase-firestore, localStorage, e no "user" lá do AuthContext que espalham os dados pela aplicacao
            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, { // atualizando os dados novos urlAvatar, e nome
              avatarUrl: urlFoto,
              nome: nome,
            })
            .then(() => {
              //Espalhando os dados de "user" e colocando os dados novos que eu quero mudar em um objeto "data"
              let data = {
                ...user,
                nome: nome,
                avatarUrl: urlFoto,
              }
              //Atualizando os dados na aplicacao
              setUser(data)
              storageUser(data)
              toast.success('Perfil atualizado com sucesso.')
            })
          })

      })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if(imageAvatar == null && nome !== ''){
      //Atualizar apenas o nome do user

      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        nome: nome,
      })
      .then(() => {
        let data = {...user, nome: nome} // estou pegando os outros dados do usuário espalhando no objeto data e mudando apenas o nome

        setUser(data)
        storageUser(data)
        toast.success('Perfil atualizado com sucesso.')
      })
    
    }else if(nome !== '' && imageAvatar !== null){
      //Atualizar tanto nome quanto a foto
      
      handleUpload()
    }
  }

  return (
    <div>
      <Header />

      <div className='content'>
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>


        <div className='container'>

          <form className='form-profile' onSubmit={handleSubmit}>
            <label className='label-avatar'>
              <span>
                <FiUpload color='#FFF' size={25} />
              </span>

              <input type='file' accept='image/*' onChange={handleFile} /> <br />
              {avatarUrl === null ? (<img src={avatarImg} alt='Foto de perfil' width={250} height={250} />) :
                (<img src={avatarUrl} alt='Foto de perfil' width={250} height={250} />)}
            </label>

            <label>Nome</label>
            <input type='text' value={nome} onChange={e => setNome(e.target.value)} />

            <label>Email</label>
            <input type='email' value={email} disabled={true} />

            <button type='submit' >Salvar</button>
          </form>
        </div>

        <div className='container'>
          <button onClick={() => logout()} className='logout-btn'>Sair</button>
        </div>
      </div>
    </div>
  )
}
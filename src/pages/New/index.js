import { FiEdit2, FiPlusCircle } from 'react-icons/fi'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/Auth'
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './new.css'

const listRef = collection(db, "customers")

function New() {
  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true)
  const [customerSelected, setCustomerSelected] = useState(0)

  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [complemento, setComplemento] = useState('')
  const [idCustomer, setIdCustomer] = useState(false)
  
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { id } = useParams()

  // toda vez que entrar nessa rota eu pego todos os clientes(customers) no firestore
  useEffect(() => {
    async function loadCustomers() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = []

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })

          if (snapshot.docs.size === 0) {
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
            setLoadCustomer(false)
            toast.info("Nenhuma empresa encontrada.")
            return
          }

          setCustomers(lista)
          setLoadCustomer(false)

          if (id) {
            loadId(lista)
          }

        }).catch((err) => {
          console.log(err)
          setLoadCustomer(false)
          toast.error('Erro ao buscar os clientes.')
          setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
        })
    }

    loadCustomers()

  }, [id])


  async function loadId(lista) {
    const docRef = doc(db, "chamados", id)
    await getDoc(docRef)
      .then((snapshot) => {

        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)

        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomerSelected(index)
        setIdCustomer(true)

      }).catch((err) => {
        console.log(err)
        toast.error('Chamado não encontrado.')
        setIdCustomer(false)
      })
  }

  function handleOptionChange(e) {
    setStatus(e.target.value)
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value)
  }

  async function handleRegister(e) {
    e.preventDefault()

    if (idCustomer) {
      // atualizando chamado 

      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,

      }).then(() => {
        setComplemento('')
        setCustomerSelected(0)
        setAssunto('Suporte')
        toast.info('Chamado atualizado.')
        navigate('/dashboard')
        
      }).catch((err) => {
        console.log(err)
        toast.error('Erro ao atualizar o chamado. Tente novamente.')
      })

      return
    }

    //registrar chamado

    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,

    }).then(() => {
      toast.success('Chamado registrado.')
      setComplemento('')
      setCustomerSelected(0)
      setAssunto('Suporte')

    }).catch((err) => {
      console.log(err)
      toast.error('Erro ao registrar o chamado. Tente novamente.')
    })
  }

  return (
    <div>
      <Header />

      <div className='content'>
        <Title name={idCustomer ? 'Editar chamado' : 'Novo chamado'}>
          
          {idCustomer ? (<FiEdit2 size={25} />) : (<FiPlusCircle size={25} />)}
        </Title>


        <div className='container'>

          <form className='form-profile' onSubmit={handleRegister}>

            <label>Clientes</label>
            {
              loadCustomer ? (
                <input type='text' disabled={true} value="carregando..." />
              ) : (
                <select value={customerSelected} onChange={handleChangeCustomer}>
                  {
                    customers.map((item, index) => {

                      return (
                        <option key={index} value={index}>
                          {item.nomeFantasia}
                        </option>
                      )
                    })
                  }
                </select>
              )
            }

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input type='radio' name='radio' value='Aberto' onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Em aberto</span>

              <input type='radio' name='radio' value='Progresso' onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>

              <input type='radio' name='radio' value='Atendido' onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type='text'
              placeholder='Descreva seu problema (opcional).'
              value={complemento}
              onChange={e => setComplemento(e.target.value)}
            />

            <button type='submit'>{idCustomer ? 'Editar' : 'Registrar'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default New
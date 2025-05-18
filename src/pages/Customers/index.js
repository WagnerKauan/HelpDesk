import Title from '../../components/Title'
import Header from '../../components/Header'
import { useState } from 'react'
import { FiUser } from 'react-icons/fi'
import schemaCustomers from '../../schemas/schemaCustomers'
import { toast } from 'react-toastify'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'



function Customers() {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [endereco, setEndereco] = useState('')

  async function handleRegister(e) {
    e.preventDefault()

    const result = schemaCustomers.safeParse({ nome, cnpj, endereco })

    if (!result.success) {
      result.error.errors.forEach(err => toast.error(err.message))
      return
    }

    await addDoc(collection(db, 'customers'), {
      nomeFantasia: nome,
      cnpj: cnpj,
      endereco: endereco,

    }).then(() => {

      setNome('')
      setCnpj('')
      setEndereco('')
      toast.success('Novo chamado cadastrado.')

    }).catch((err) => {
      console.log(err)
      toast.error('Erro ao cadastrar o chamado.')
    })

  }

  return (
    <div>
      <Header />
      <div className='content'>
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleRegister}>
            <label>Nome fantasia</label>
            <input type='text' placeholder='Nome da empresa' value={nome} onChange={e => setNome(e.target.value)} />

            <label>CNPJ</label>
            <input type='text' placeholder='Digite o CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />

            <label>Endereço</label>
            <input type='text' placeholder='Endereço da empresa' value={endereco} onChange={e => setEndereco(e.target.value)} />

            <button type='submit' >Salvar</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Customers
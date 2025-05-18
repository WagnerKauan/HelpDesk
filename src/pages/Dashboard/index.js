import { useEffect, useState } from "react"
import Header from "../../components/Header"
import Title from "../../components/Title"
import Modal from "../../components/Modal"
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi"
import { Link } from "react-router-dom"
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { format } from 'date-fns'
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import './dashboard.css'

const chamadosRef = collection(db, "chamados")

const Dashboard = () => {
  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastDocs, setLastDocs] = useState(null)
  const [isEmpty, setIsEmpty] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    async function loadChamados() {
      const q = query(chamadosRef, orderBy('created', 'desc'), limit(5))
      const querySnapshot = await getDocs(q)
      setChamados([]) // evitar duplicação no StrictMode
      await updateState(querySnapshot)
      setLoading(false)
    }
    loadChamados()
  }, [])

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0
    if (!isCollectionEmpty) {
      let lista = []
      querySnapshot.forEach(doc => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        })
      })
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]
      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc)
      setLoadingMore(false)
    } else {
      setIsEmpty(true)
      setLoadingMore(false)
      return true
    }
  }

  async function handleMore() {
    setLoadingMore(true)
    const q = query(chamadosRef, orderBy('created' , 'desc'), startAfter(lastDocs), limit(5))
    const querySnapshot = await getDocs(q)
    const isCollectionEmpty = await updateState(querySnapshot)
    if(isCollectionEmpty){
      toast.info('Não foram encontrados mais chamados.')
    }
  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  function getStatusColor(status){
    switch(status){
        case 'Progresso':
          return '#0275d8'
        case 'Atendido':
          return '#83bf02'
        default:
          return '#999'
    }
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado encontrado...</span>
            <Link className="new" to='/new' >
              <FiPlus color="#FFF" size={25} />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link className="new" to='/new' >
              <FiPlus color="#FFF" size={25} />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col" >Cliente</th>
                  <th scope="col" >Assunto</th>
                  <th scope="col" >Status</th>
                  <th scope="col" >Cadastrado em</th>
                  <th scope="col" >#</th>
                </tr>
              </thead>

              <tbody>
                {chamados.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <td data-label="cliente">{item.cliente}</td>
                    <td data-label="Assunto">{item.assunto}</td>
                    <td data-label="Status">
                      <span className="badge" style={{backgroundColor: getStatusColor(item.status)}}>{item.status}</span>
                    </td>
                    <td data-label="Cadastrado">{item.createdFormat}</td>
                    <td className="btns-table" data-label="#">
                      <button onClick={() => toggleModal(item)} className="action" style={{ backgroundColor: '#3583f6' }}>
                        <FiSearch color="#FFF" size={17} />
                      </button>
                      <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                        <FiEdit2 color="#FFF" size={17} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {loadingMore && (<h3 className="load-more">Buscando próximos chamados...</h3>)}
            {!loadingMore && !isEmpty && (
              <motion.button
                className="btn-more"
                onClick={handleMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buscar mais
              </motion.button>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showPostModal && (
          <Modal
            conteudo={detail}
            close={() => setShowPostModal(false)}
            statusColor={getStatusColor}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard

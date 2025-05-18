import { FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import './modal.css'

function Modal({ conteudo, close, statusColor }) {
  return (
    <AnimatePresence>
      {conteudo && (
        <motion.div
          className='modal'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}  // fecha o modal se clicar fora
          style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
        >
          <motion.div
            className='container'
            id='space-mobile'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro do modal
          >
            <button onClick={close} className='close'>
              <FiX size={25} color='#f65835' />
            </button>

            <main>
              <h2>Detalhes do chamado</h2>

              <div className='row'>
                <span>
                  Cliente: <i>{conteudo.cliente}</i>
                </span>
              </div>

              <div className='row'>
                <span>
                  Assunto: <i>{conteudo.assunto}</i>
                </span>

                <span>
                  Cadastrado em: <i>{conteudo.createdFormat}</i>
                </span>
              </div>

              <div className='row'>
                <span>
                  Status: <i style={{ color: statusColor(conteudo.status) }}>{conteudo.status}</i>
                </span>
              </div>

              {conteudo.complemento !== '' && (
                <>
                  <h3>Complemento</h3>
                  <p>{conteudo.complemento}</p>
                </>
              )}
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal

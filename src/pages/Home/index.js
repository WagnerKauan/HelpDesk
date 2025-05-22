import { MdSupportAgent } from 'react-icons/md'
import Counter from '../../components/Counter'
import "./home.css"
import { Link } from 'react-router-dom'

function Home() {


  return (
    <div className="container-home ">
      <header className="header-home">
        <div className="logo-home">
          Helpify <MdSupportAgent />
        </div>

        <div className='buttons-home'>
           <Link to="/login" >Entrar</Link>
          <Link to="/register" >Registrar</Link>
        </div>
      </header>

      <main className='main-home'>

        <div className='hero-home'>
          <div className='texts-home'>
            <h1>Helpify — Gerencie Empresas e Chamados</h1>

            <p>
              Um mini CRM feito pra te ajudar a manter sua operação organizada. Registre empresas, abra chamados, acompanhe o status, organize visitas técnicas e tenha o controle total dos atendimentos de forma simples, prática e sem dor de cabeça.
            </p>

            <Link to="/register" >Começar Agora</Link>
          </div>

          <div className='image-home'>
            <img src="/image_hero.svg" alt="Imagem Hero" />
          </div>
        </div>
      </main>

      <section className='metrics-section'>
        <div className='metrics-grid'>
          <Counter end={120} label={"Empresas Cadastradas"} />
          <Counter end={1000} label={"Chamados Resolvidos"} />
          <Counter end={700} label={"Usuários Ativos"} />
        </div>
      </section>
    </div>
  )
}

export default Home
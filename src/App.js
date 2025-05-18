import { BrowserRouter } from "react-router-dom"
import RoutesApp from "./Routes"
import { ToastContainer } from "react-toastify"
import AuthProvier from "./contexts/Auth"
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <BrowserRouter>
      <AuthProvier>
        <ToastContainer autoClose={3000} />
        <RoutesApp />
      </AuthProvier>
    </BrowserRouter>
  )
}

export default App
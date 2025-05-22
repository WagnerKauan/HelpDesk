import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import "./notfound.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";

const NotFound = () => {
  const { signed } = useContext(AuthContext)

  

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-description">
        Opa... Parece que você se perdeu no caminho! <br />
        A página que você tentou acessar não existe.
      </p>
      <Link to={signed ? "/dashboard" : "/"} className="notfound-button">
        <FaArrowLeftLong />
        Voltar pra Home
      </Link>
    </div>
  );
};

export default NotFound;

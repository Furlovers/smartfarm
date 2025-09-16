import logo from "/src/assets/logo.png";
import StyledInput from "./components/styledInput";
import { useState } from "react";
import LoginImage from "/src/assets/login_image.png";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../utils/contexts/UserContext";
import ErrorBox from "../../components/ErrorBox";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function SendLogin(event) {
    event.preventDefault();
    login({ email, password })
      .then(() => {
        setErrorMessage("");
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message || "Erro ao fazer login");
      });
  }

  function SendRegister(event) {
    event.preventDefault();
    register({
      email: email,
      password: password,
      name: `${name} ${surname}`,
      address: "",
    })
      .then(() => {
        setIsLogin(true);
        setErrorMessage("");
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message || "Erro ao cadastrar");
      });
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 md:p-8">
      {/* LADO ESQUERDO (IMAGEM) - Oculta em mobile */}
      <div className="hidden md:block md:h-full md:w-[40%] p-2">
        <div className="h-full w-full rounded-md">
          <img 
            src={LoginImage} 
            className="h-full w-full object-cover rounded-lg" 
            alt="Ilustração de fazenda inteligente"
          />
        </div>
      </div>

      {/* LADO DIREITO (FORMULÁRIO) */}
      <div className="w-full md:w-1/2 p-2 flex flex-col items-start justify-between md:pl-12 py-4 md:py-8">
        {/* LOGO */}
        <div className="w-full flex justify-center md:justify-start mb-4 md:mb-0">
          <Link to="/">
          <img src={logo} alt="SmartFarm Logo" className="h-16 md:h-20" />
          </Link>
        </div>

        {/* FORMULÁRIO */}
        <div className="w-full flex flex-col items-center md:items-start justify-center mt-4 md:mt-0">
          {/* TOGGLE ENTRE LOGIN/CADASTRO */}
          <div className="flex felx-row items-center justify-center w-full mb-6 md:mb-8 md:mt-16">
            <div
              onClick={() => {
                setIsLogin(true);
                setErrorMessage("");
              }}
              className="cursor-pointer"
            >
              <h1
                className={`text-xl md:text-2xl font-bold ${
                  isLogin
                    ? "text-blue-950"
                    : "text-gray-400 hover:text-blue-950 transition-colors duration-300"
                }`}
              >
                Entrar
              </h1>
            </div>
            <div className="w-0.5 h-6 md:h-7 bg-black mx-3 md:mx-4"></div>
            <div
              onClick={() => {
                setIsLogin(false);
                setErrorMessage("");
              }}
              className="cursor-pointer"
            >
              <h1
                className={`text-xl md:text-2xl font-bold ${
                  !isLogin
                    ? "text-blue-950"
                    : "text-gray-400 hover:text-blue-950 transition-colors duration-300"
                }`}
              >
                Cadastrar
              </h1>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form className="flex flex-col gap-4 w-full max-w-md">
            <StyledInput
              type={"email"}
              placeholder={"E-MAIL"}
              onChange={setEmail}
              value={email}
            />
            <StyledInput
              type={"password"}
              placeholder={"SENHA"}
              onChange={setPassword}
              value={password}
            />
            
            {!isLogin && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <StyledInput
                    type={"text"}
                    placeholder={"NOME"}
                    onChange={setName}
                    value={name}
                  />
                  <StyledInput
                    type={"text"}
                    placeholder={"SOBRENOME"}
                    onChange={setSurname}
                    value={surname}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-4 h-4 border-2 border-blue-950 rounded"
                  />
                  <label htmlFor="terms" className="text-sm md:text-base">
                    Aceito os termos e condições para a utilização dos meus dados
                  </label>
                </div>
              </div>
            )}
          </form>

          {/* MENSAGEM DE ERRO */}
          <ErrorBox message={errorMessage} className="w-full max-w-md mt-4" />
        </div>

        {/* BOTÃO */}
        <div className="w-full flex justify-center md:justify-start mt-6 md:mt-0 md:pt-12">
          <button
            className="bg-blue-950 text-white rounded-md px-6 py-2 w-full max-w-md md:w-32 hover:bg-blue-900 transition-colors"
            onClick={isLogin ? SendLogin : SendRegister}
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
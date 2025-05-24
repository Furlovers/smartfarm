import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { FaHeadset } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-green-600 bg-gradient-to-b pt-12">
      <div className="container mx-auto text-center text-white py-12 px-4">
        <h2 className="font-bold text-4xl md:text-5xl mb-8">
          Pronto para transformar sua fazenda?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Comece hoje mesmo e veja os resultados em sua próxima colheita.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/services">
            <Button> Veja os nossos serviços</Button>
          </Link>
          <Link to="https://www.linkedin.com/in/brunogiannini/" target="_blank">
            <Button
              background="bg-white"
              text="text-green-600"
              hover="hover:bg-gray-200"
              className="flex items-center"
            >
              <FaHeadset className="me-2 text-xl" /> Fale com nossa equipe
            </Button>
          </Link>
        </div>
        <div className="mt-12 mb-0 text-sm opacity-80">
          2025 SmartFarm. Versão: 1.0.0
        </div>
      </div>
    </div>
  );
}

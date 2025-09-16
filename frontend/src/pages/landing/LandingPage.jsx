import bgimage from "../../assets/landingpage_bg.jpeg";
import sensor from "../../assets/sensor.png";
import Button from "../../components/ui/Button";
import NavLanding from "/src/components/NavLanding/NavLanding.jsx";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import Footer from "/src/components/Footer.jsx";
import ProductsSection from "./components/ProductsSection";

export default function LandingPage() {
  return (
    <>
      <NavLanding />
      <div className="bg-gray-100 pt-16">
        {/* Seção do topo (hero) */}
        <div
          className="relative overflow-hidden flex items-center"
          style={{
            backgroundImage: `url(${bgimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay escuro na imagem */}
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10"></div>

          {/* Texto que sobrepõe a imaegm */}
          <div className="container relative z-20 mx-auto p-8 lg:p-16 lg:px-20">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 w-full text-white text-center md:text-left py-12 md:py-0">
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 animate_animated animate_fadeInDown">
                  A SUA FAZENDA MAIS{" "}
                  <span className="text-green-500">INTELIGENTE</span> E
                  CONECTADA
                </h1>
                <p className="text-xl mb-8 animate_animated animatefadeIn animate_delay-1s">
                  Aumente a eficiência, reduza custos e melhore seus resultados
                  com soluções acessíveis e tecnologia de ponta.
                </p>
                <a href="#products">
                  <Button>Saiba Mais</Button>
                </a>
              </div>

              <div className="md:w-1/2 w-full flex justify-center md:justify-end py-12 md:py-0">
                <div className="flex justify-center mb-6">
                  <div
                    className={
                      "bg-white rounded-full p-4 mb-6 mx-auto w-45 h-45 lg:w-70 lg:h-70 flex items-center justify-center"
                    }
                  >
                    <img
                      src={sensor}
                      alt="Sensor SmartFarm"
                      className="w-50 h-50 lg:w-75 lg:h-75 object-contain absolute"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AboutSection />
        <ServicesSection />
        <ProductsSection />
      </div>
      <Footer />
          
    </>
  );
}

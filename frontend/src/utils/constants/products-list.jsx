import { GiFarmTractor, GiWaterDrop } from "react-icons/gi";
import { FaRobot } from "react-icons/fa"; 

export const productTiers = [
  {
    name: "Básico",
    price: "Grátis",
    description: "Ideal para pequenos produtores que estão começando",
    features: [
      "Conexão com até 10 sensores",
      "Anúncios no painel",
      "Atualização dos dashboards a cada 3 horas",
      "Suporte por e-mail em até 48h"
    ],
  },
  {
    name: "Intermediário",
    price: "R$ 150/mês",
    description: "Para produtores que querem mais controle e personalização",
    features: [
      "Até 2 perfis de usuário",
      "Conexão com até 50 sensores",
      "Sem anúncios no painel",
      "Atualização dos dashboards a cada hora",
      "Suporte por chat em até 24h",
      "Relatórios personalizáveis"
    ],
  },
  {
    name: "Premium",
    price: "R$ 299/mês",
    description: "A solução mais avançada com inteligência preditiva",
    features: [
      "Até 5 perfis de usuário",
      "Conexão com até 200 sensores por perfil",
      "Sem anúncios no painel",
      "Dados atualizados em tempo real",
      "Suporte com gerente dedicado",
      "Análises preditivas com IA",
      "Alertas personalizados"
    ],
  }
];

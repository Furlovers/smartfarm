import 'package:flutter/material.dart';

class MainService {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String description;
  final List<String> features;

  const MainService({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.description,
    required this.features,
  });
}

class AdditionalService {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String description;

  const AdditionalService({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.description,
  });
}

const mainServices = <MainService>[
  MainService(
    icon: Icons.agriculture,
    iconColor: Color(0xFF16A34A),
    title: 'Monitoramento Agrícola',
    description:
        'Sensores inteligentes para acompanhamento em tempo real das condições do solo, clima e cultivos.',
    features: [
      'Umidade do solo',
      'Temperatura ambiente',
      'Luminosidade',
      'Previsão de pragas',
    ],
  ),
  MainService(
    icon: Icons.water_drop,
    iconColor: Color(0xFF2563EB),
    title: 'Gestão de Irrigação',
    description:
        'Sistema automatizado de irrigação que ajusta o fluxo de água conforme as necessidades da plantação.',
    features: [
      'Controle por aplicativo',
      'Economia de água',
      'Programação inteligente',
      'Alertas de vazamento',
    ],
  ),
  MainService(
    icon: Icons.analytics,
    iconColor: Color(0xFFF59E0B),
    title: 'Análise de Dados',
    description:
        'Plataforma de analytics com relatórios personalizados para tomada de decisão baseada em dados.',
    features: [
      'Histórico completo',
      'Tendências de crescimento',
      'Recomendações personalizadas',
      'Integração com ERP',
    ],
  ),
];


const additionalServices = <AdditionalService>[
  AdditionalService(
    icon: Icons.smartphone,
    iconColor: Color(0xFF60A5FA),
    title: 'Aplicativo Mobile',
    description:
        'Controle sua fazenda de qualquer lugar através do nosso aplicativo exclusivo.',
  ),
  AdditionalService(
    icon: Icons.cloud,
    iconColor: Color(0xFF6B7280),
    title: 'Armazenamento em Nuvem',
    description: 'Todos seus dados seguros e acessíveis de qualquer dispositivo.',
  ),
  AdditionalService(
    icon: Icons.build,
    iconColor: Color(0xFFEF4444),
    title: 'Manutenção Preventiva',
    description:
        'Nossa equipe realiza manutenções periódicas para evitar falhas.',
  ),
  AdditionalService(
    icon: Icons.headset_mic,
    iconColor: Color(0xFF16A34A),
    title: 'Suporte 24/7',
    description:
        'Equipe especializada disponível a qualquer momento para auxiliar.',
  ),
];

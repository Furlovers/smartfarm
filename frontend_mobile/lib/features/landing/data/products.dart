import 'package:flutter/material.dart';

class ProductTier {
  final String name;
  final String price;
  final String description;
  final List<String> features;
  final Color color;

  const ProductTier({
    required this.name,
    required this.price,
    required this.description,
    required this.features,
    required this.color,
  });
}

const productTiers = <ProductTier>[
  ProductTier(
    name: 'Básico',
    price: 'Grátis',
    description: 'Ideal para pequenos produtores que estão começando',
    features: [
      'Conexão com até 10 sensores',
      'Anúncios no painel',
      'Atualização dos dashboards a cada 3 horas',
      'Suporte por e-mail em até 48h',
    ],
    color: Color(0xFF16A34A),
  ),
  ProductTier(
    name: 'Intermediário',
    price: 'RS 150/mês',
    description: 'Para produtores que querem mais controle e personalização',
    features: [
      'Até 2 perfis de usuário',
      'Conexão com até 50 sensores',
      'Sem anúncios no painel',
      'Atualização dos dashboards a cada hora',
      'Suporte por chat em até 24h',
      'Relatórios personalizáveis',
    ],
    color: Color(0xFF2563EB),
  ),
  ProductTier(
    name: 'Premium',
    price: 'RS 299/mês',
    description: 'A solução mais avançada com inteligência preditiva',
    features: [
      'Até 5 perfis de usuário',
      'Conexão com até 200 sensores por perfil',
      'Sem anúncios no painel',
      'Dados atualizados em tempo real',
      'Suporte com gerente dedicado',
      'Análises preditivas com IA',
      'Alertas personalizados',
    ],
    color: Color(0xFFF59E0B),
  ),
];

import 'package:flutter/material.dart';
import 'about_card.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {

    
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
      child: Column(
        children: [

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.shade100,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.lightbulb, color: Colors.green.shade600, size: 18),
                const SizedBox(width: 6),
                Text(
                  'CONECTIVIDADE INTELIGENTE',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: Colors.green.shade600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'CONECTE SEU CAMPO AO FUTURO: DADOS PRECISOS, DECISÕES INTELIGENTES',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Nossa plataforma integrada oferece monitoramento em tempo real e análises preditivas para maximizar sua produtividade.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: const Color(0xFF6B7280),
                ),
          ),
          const SizedBox(height: 20),

  const Column(
    children: [
    AboutCard(
      title: 'Monitoramento Preciso',
      description:
          'Dados em tempo real da umidade do solo, temperatura ambiente e luminosidade para decisões precisas.',
      icon: Icons.water_drop,
      iconColor: Color(0xFF2563EB),
    ),
    SizedBox(height: 12),
    AboutCard(
      title: 'Análises Preditivas',
      description:
          'Relatórios detalhados e previsões para otimizar o uso de insumos e aumentar a produtividade.',
      icon: Icons.device_thermostat,
      iconColor: Color(0xFFDC2626),
    ),
    SizedBox(height: 12),
    AboutCard(
      title: 'Conectividade Total',
      description:
          'Sistema integrado que funciona mesmo em áreas remotas, com baixo consumo de energia.',
      icon: Icons.wifi,
      iconColor: Color(0xFF16A34A),
    ),
  ],
),
        ],
      ),
    );
  }
}

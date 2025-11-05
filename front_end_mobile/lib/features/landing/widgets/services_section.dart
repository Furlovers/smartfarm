import 'package:flutter/material.dart';
import '../data/services.dart';
import 'service_card.dart';
import 'additional_service_card.dart';

class ServicesSection extends StatelessWidget {
  const ServicesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
      child: Column(
        children: [
          // header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.shade100,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.eco, color: Colors.green.shade600, size: 18),
                const SizedBox(width: 6),
                Text(
                  'SOLUÇÕES COMPLETAS',
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
            'Tecnologia Agrícola de Ponta',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Oferecemos um ecossistema integrado de soluções para modernizar sua fazenda e aumentar sua produtividade.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: const Color(0xFF6B7280),
                ),
          ),
          const SizedBox(height: 20),

          // grid principal (no mobile: cards empilhados)
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (_, i) {
              final s = mainServices[i];
              return ServiceCard(
                icon: s.icon,
                title: s.title,
                description: s.description,
                features: s.features,
              );
            },
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: mainServices.length,
          ),

          const SizedBox(height: 24),

          // bloco cinza com vantagens (additionalServices)
          Container(
            width: double.infinity,
            color: const Color(0xFFF3F4F6), // gray-100
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // badge "VANTAGENS"
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.green.shade100,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.show_chart,
                          color: Colors.green.shade600, size: 18),
                      const SizedBox(width: 6),
                      Text(
                        'VANTAGENS',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Colors.green.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Por que escolher nossos serviços?',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Nossa plataforma integrada oferece tudo que você precisa para a agricultura de precisão em um único lugar.',
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(color: const Color(0xFF6B7280)),
                ),
                const SizedBox(height: 16),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemBuilder: (_, i) {
                    final s = additionalServices[i];
                    return AdditionalServiceCard(
                      icon: s.icon,
                      title: s.title,
                      description: s.description,
                    );
                  },
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemCount: additionalServices.length,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

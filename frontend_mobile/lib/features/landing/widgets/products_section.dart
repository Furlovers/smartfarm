import 'package:flutter/material.dart';
import '../data/products.dart';
import 'product_card.dart';

class ProductsSection extends StatelessWidget {
  const ProductsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      child: Column(
        children: [
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.shade100,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.agriculture, color: Colors.green.shade600, size: 18),
                const SizedBox(width: 6),
                Text(
                  'PLANOS DISPONÍVEIS',
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
            'Soluções para todos os tamanhos',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 6),
          Text(
            'Oferecemos opções flexíveis que se adaptam às necessidades da sua fazenda',
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .bodyLarge
                ?.copyWith(color: const Color(0xFF6B7280)),
          ),
          const SizedBox(height: 16),

          // no mobile: cards empilhados
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (_, i) => ProductCard(tier: productTiers[i]),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: productTiers.length,
          ),
        ],
      ),
    );
  }
}

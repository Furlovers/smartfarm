import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class LandingFooter extends StatelessWidget {
  final VoidCallback? onSeeServices; // âncora para #services
  final String supportUrl;           // LinkedIn (ou outro canal)
  final String version;

  const LandingFooter({
    super.key,
    this.onSeeServices,
    required this.supportUrl,
    this.version = '1.0.0',
  });

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;

    return Container(
      padding: const EdgeInsets.only(top: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [primary, primary.withValues(alpha:0.85)],
        ),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            children: [
              Text(
                'Pronto para transformar sua fazenda?',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: 12),
              Text(
                'Comece hoje mesmo e veja os resultados em sua próxima colheita.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Colors.black.withValues(alpha: 0.9),

                    ),
              ),
              const SizedBox(height: 20),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 12,
                runSpacing: 12,
                children: [
                  ElevatedButton(
                    onPressed: onSeeServices,
                    child: const Text('Veja os nossos serviços'),
                  ),
                  OutlinedButton.icon(
                    onPressed: () async {
                      final uri = Uri.parse(supportUrl);
                      if (await canLaunchUrl(uri)) {
                        await launchUrl(uri, mode: LaunchMode.externalApplication);
                      }
                    },
                    icon: const Icon(Icons.headset_mic),
                    label: const Text('Fale com nossa equipe'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white),
                      backgroundColor: Colors.black.withValues(alpha: 0.06),

                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Opacity(
                opacity: 0.8,
                child: Text(
                  '2025 SmartFarm. Versão: $version',
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}

// lib/features/landing/ui/landing_page.dart
import 'package:flutter/material.dart';
import '../../../shared/widgets/nav_landing_mobile.dart';
import '../../../shared/widgets/footer.dart';
import '../widgets/about_section.dart';
import '../widgets/services_section.dart';
import '../widgets/products_section.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});
  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final aboutKey = GlobalKey();
  final servicesKey = GlobalKey();
  final productsKey = GlobalKey();

  final listKey = GlobalKey();
  final scroll = ScrollController();

  // função para controlar o scroll pela navbar
  void _scrollTo(GlobalKey key) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final sectionCtx = key.currentContext;
      final listCtx = listKey.currentContext;
      if (sectionCtx == null || listCtx == null) return;

      final sectionBox = sectionCtx.findRenderObject() as RenderBox;
      final listBox = listCtx.findRenderObject() as RenderBox;

      final dy = sectionBox.localToGlobal(Offset.zero, ancestor: listBox).dy;

      final topBar = MediaQuery.of(context).padding.top + 56.0;

      final target = (scroll.offset + dy - topBar)
          .clamp(0.0, scroll.position.maxScrollExtent);

      scroll.animateTo(
        target,
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          ListView(
            key: listKey,
            controller: scroll,
            padding: EdgeInsets.zero,
            children: [
              const SizedBox(height: 72),
              _HeroSection(onSeeMore: () => _scrollTo(productsKey)),
              Container(key: aboutKey, child: const AboutSection()),
              Container(key: servicesKey, child: const ServicesSection()),
              Container(key: productsKey, child: const ProductsSection()),
              const SizedBox(height: 8),
              const Divider(height: 0),
              LandingFooter(
                onSeeServices: () => _scrollTo(servicesKey),
                supportUrl: 'https://www.linkedin.com/in/brunogiannini/',
                version: '1.0.0',
              ),
            ],
          ),

          NavLandingMobile(
            logoAsset: 'assets/images/logo.png',
            onAbout: () => _scrollTo(aboutKey),
            onServices: () => _scrollTo(servicesKey),
            onProducts: () => _scrollTo(productsKey),
          ),
        ],
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  final VoidCallback onSeeMore;
  const _HeroSection({required this.onSeeMore});

  @override
  Widget build(BuildContext context) {
    final screenH = MediaQuery.of(context).size.height;
    final small = screenH < 750;
    final sensorSize = small ? 100.0 : 130.0;
    final gapSm = small ? 8.0 : 12.0;

    return Container(
      color: const Color(0xFFF3F4F6), // gray-100
      padding: const EdgeInsets.only(top: 16),
      child: Container(
        constraints: const BoxConstraints(minHeight: 420),
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/landingpage_bg.jpeg'),
            fit: BoxFit.cover,
            alignment: Alignment.center,
          ),
        ),
        child: Stack(
          fit: StackFit.passthrough,
          children: [
            // overlay escuro
            Positioned.fill(
              child: ColoredBox(color: Colors.black54),
            ),

            // conteúdo central
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 800),
                  child: Column(
                    mainAxisSize: MainAxisSize.min, // 👈 encolhe, não estica
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text.rich(
                        TextSpan(
                          text: 'A SUA FAZENDA MAIS ',
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                              ),
                          children: [
                            TextSpan(
                              text: 'INTELIGENTE',
                              style: TextStyle(
                                color: Colors.green.shade400,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            const TextSpan(text: ' E CONECTADA'),
                          ],
                        ),
                        textAlign: TextAlign.center,
                      ),

                      SizedBox(height: gapSm),
                      Text(
                        'Aumente a eficiência, reduza custos e melhore seus resultados com soluções acessíveis e tecnologia de ponta.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: Colors.white.withOpacity(0.95),
                            ),
                      ),

                      SizedBox(height: gapSm),
                      ElevatedButton(
                        onPressed: onSeeMore,
                        child: const Text('Saiba Mais'),
                      ),

                      SizedBox(height: gapSm * 2),
                      SizedBox(
                        height: sensorSize + 20,
                        child: Center(
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                width: sensorSize,
                                height: sensorSize,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.15),
                                      blurRadius: 12,
                                      offset: const Offset(0, 6),
                                    ),
                                  ],
                                ),
                              ),
                              Positioned.fill(
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Image.asset(
                                    'assets/images/sensor.png',
                                    fit: BoxFit.contain,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}

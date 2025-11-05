import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NavLandingMobile extends StatefulWidget {
  final VoidCallback? onAbout;
  final VoidCallback? onServices;
  final VoidCallback? onProducts;
  final String logoAsset;

  const NavLandingMobile({
    super.key,
    required this.logoAsset,
    this.onAbout,
    this.onServices,
    this.onProducts,
  });

  @override
  State<NavLandingMobile> createState() => _NavLandingMobileState();
}

class _NavLandingMobileState extends State<NavLandingMobile>
    with SingleTickerProviderStateMixin {
  bool _isOpen = false;

  void _toggle() => setState(() => _isOpen = !_isOpen);
  void _close() => setState(() => _isOpen = false);

  @override
  Widget build(BuildContext context) {
    final paddingTop = MediaQuery.of(context).padding.top;
    const topBarHeight = 56.0;
    final top = paddingTop + topBarHeight;

    return Stack(
      children: [
        // TOP BAR com fundo branco + sombra
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            bottom: false,
            child: Container(
              height: topBarHeight,
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  IconButton(
                    onPressed: _toggle,
                    icon: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 200),
                      child: Icon(
                        _isOpen ? Icons.close : Icons.menu,
                        key: ValueKey(_isOpen),
                      ),
                    ),
                  ),
                  const Spacer(),
                  InkWell(
                    onTap: _close,
                    child: Image.asset(
                      widget.logoAsset,
                      height: 40,
                      fit: BoxFit.contain,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // OVERLAY escuro para fechar
        if (_isOpen)
          Positioned.fill(
            top: top,
            child: GestureDetector(
              onTap: _close,
              child: Container(color: Colors.black.withValues(alpha: 0.5),
),
            ),
          ),

        // PAINEL DO MENU (ocupa o espaço abaixo da top bar; rolável)
        Positioned(
          top: top,
          left: 0,
          right: 0,
          bottom: 0,
          child: IgnorePointer(
            ignoring: !_isOpen,
            child: AnimatedOpacity(
              opacity: _isOpen ? 1 : 0,
              duration: const Duration(milliseconds: 200),
              child: Material(
                color: Colors.white,
                elevation: 6,
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    _MenuItem(
                      label: 'Sobre',
                      onTap: () {
                        _close();
                        widget.onAbout?.call();
                      },
                    ),
                    _MenuItem(
                      label: 'Serviços',
                      onTap: () {
                        _close();
                        widget.onServices?.call();
                      },
                    ),
                    _MenuItem(
                      label: 'Produtos',
                      onTap: () {
                        _close();
                        widget.onProducts?.call();
                      },
                    ),
                    const Divider(height: 0),
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            _close();
                            if (context.mounted) context.go('/login');
                          },
                          child: const Text('ENTRAR'),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _MenuItem extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  const _MenuItem({required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.w700,
            color: Color(0xFF374151), // gray-700
          ),
        ),
      ),
    );
  }
}

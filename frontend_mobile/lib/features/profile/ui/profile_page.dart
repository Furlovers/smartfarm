// lib/features/profile/ui/profile_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../auth/providers/user_providers.dart';
import '../../../shared/widgets/error_box.dart';
import '../../../shared/dialogs/confirmation_dialog.dart';

class ProfilePage extends ConsumerStatefulWidget {
  const ProfilePage({super.key});

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final addressCtrl = TextEditingController();
  bool _initialized = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // garante dados atualizados
    Future.microtask(() => ref.read(userViewProvider.notifier).fetchUserData());
  }

  @override
  void dispose() {
    nameCtrl.dispose();
    emailCtrl.dispose();
    addressCtrl.dispose();
    super.dispose();
  }

  String _planLabel(String? role) {
    switch (role) {
      case 'user-basic':
        return 'Básico';
      case 'user-intermediary':
        return 'Intermediário';
      case 'user-premium':
        return 'Premium';
      default:
        return '—';
    }
  }

  String _avatarForRole(String? role) {
    switch (role) {
      case 'user-basic':
        return 'assets/images/farmerBasic.png';
      case 'user-intermediary':
        return 'assets/images/farmerIntermediary.png';
      case 'user-premium':
        return 'assets/images/farmerPremium.png';
      default:
        return 'assets/images/farmerBasic.png';
    }
  }

  String _memberSince(DateTime? dt) {
    if (dt == null) return '—';
    return DateFormat('dd/MM/yyyy').format(dt);
  }

  Future<void> _save() async {
    setState(() => _error = null);
    try {
      await ref.read(userViewProvider.notifier).updateProfile({
        'name': nameCtrl.text.trim(),
        'email': emailCtrl.text.trim(),
        'address': addressCtrl.text.trim(),
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Perfil atualizado com sucesso.')),
      );
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _delete() async {
    final ok = await showConfirmationBox(
      context,
      message: 'Tem certeza que deseja excluir sua conta?',
    );
    if (ok != true) return;
    try {
      await ref.read(userViewProvider.notifier).deleteUser();
      if (!mounted) return;
      context.go('/login');
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _logout() async {
    await ref.read(userViewProvider.notifier).logout();
    if (!mounted) return;
    context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final asyncUser = ref.watch(userViewProvider);

    return asyncUser.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) => Scaffold(body: Center(child: Text('Erro ao carregar: $e'))),
      data: (view) {
        if (view == null) {
          return const Scaffold(body: Center(child: Text('Faça login para acessar o perfil.')));
        }
        // inicializa os campos uma única vez quando os dados chegam
        if (!_initialized) {
          nameCtrl.text = view.name ?? '';
          emailCtrl.text = view.email ?? '';
          addressCtrl.text = view.address ?? '';
          _initialized = true;
        }

        final avatar = _avatarForRole(view.role);
        final plan = _planLabel(view.role);
        return Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.go('/dashboard'),
            ),
            title: const Text('Perfil'),
            actions: [
              IconButton(
                tooltip: 'Logout',
                icon: const Icon(Icons.logout),
                onPressed: _logout,
              ),
            ],
          ),
          body: ListView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
            children: [
              // Header com faixa azul + avatar sobreposto + nome/role/data
              Container(
                decoration: const BoxDecoration(
                  color: Color(0xFF0B1B52), // azul
                  borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                ),
                height: 80,
              ),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 10,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                transform: Matrix4.translationValues(0, -36, 0),
                padding: const EdgeInsets.fromLTRB(16, 48, 16, 16),
                child: Column(
                  children: [
                    // avatar circular
                    Positioned.fill(
                      child: Align(
                        alignment: Alignment.topCenter,
                        child: CircleAvatar(
                          radius: 40,
                          backgroundColor: Colors.white,
                          backgroundImage: AssetImage(avatar),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      nameCtrl.text.isEmpty ? (view.name ?? '—') : nameCtrl.text,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Plano: $plan',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[700]),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.access_time, size: 16, color: Colors.grey),
                        const SizedBox(width: 6),
                        Text(
                          'Membro desde ${_memberSince(view.dateOfJoining)}',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey[700]),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // Formulário
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _Field(
                        label: 'Nome',
                        child: TextField(
                          controller: nameCtrl,
                          decoration: const InputDecoration(hintText: 'Seu nome'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _Field(
                        label: 'Email',
                        child: TextField(
                          controller: emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(hintText: 'email@exemplo.com'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _Field(
                        label: 'Plano',
                        child: TextField(
                          controller: TextEditingController(text: plan),
                          enabled: false,
                          decoration: const InputDecoration(
                            disabledBorder: OutlineInputBorder(),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _Field(
                        label: 'Endereço',
                        child: TextField(
                          controller: addressCtrl,
                          decoration: const InputDecoration(hintText: 'Rua, número, cidade'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              if (_error != null && _error!.isNotEmpty) ...[
                const SizedBox(height: 12),
                ErrorBox(message: _error),
              ],

              const SizedBox(height: 12),

              // Ações
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _delete,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFDC2626),
                        side: const BorderSide(color: Color(0xFFDC2626)),
                      ),
                      child: const Text('Excluir Conta'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _save,
                      child: const Text('Salvar Alterações'),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 8),

              // Voltar ao Dashboard (opcional — já temos back na AppBar)
              TextButton.icon(
                onPressed: () => context.go('/dashboard'),
                icon: const Icon(Icons.chevron_left),
                label: const Text('Voltar ao Dashboard'),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Field extends StatelessWidget {
  final String label;
  final Widget child;
  const _Field({required this.label, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        child,
      ],
    );
  }
}

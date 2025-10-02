import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/providers/user_providers.dart';
import '../../../shared/widgets/error_box.dart';
import '../../../shared/widgets/styled_input.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  bool isLogin = true;
  bool isLoading = false;
  String? errorMessage;

  final emailCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  final nameCtrl = TextEditingController();
  final surnameCtrl = TextEditingController();
  bool acceptedTerms = false;

  @override
  void dispose() {
    emailCtrl.dispose();
    passCtrl.dispose();
    nameCtrl.dispose();
    surnameCtrl.dispose();
    super.dispose();
  }

  Future<void> _sendLogin() async {
    FocusScope.of(context).unfocus();
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
    try {
      await ref
          .read(userViewProvider.notifier)
          .login(email: emailCtrl.text.trim(), password: passCtrl.text);
      if (!mounted) return;
      context.go('/dashboard');
    } on DioException catch (e) {
      setState(() {
        errorMessage = e.message ?? 'Erro ao efetuar login.';
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  Future<void> _sendRegister() async {
    FocusScope.of(context).unfocus();
    if (!acceptedTerms) {
      setState(() => errorMessage = 'Você precisa aceitar os termos e condições.');
      return;
    }
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
    try {
      await ref.read(userViewProvider.notifier).register({
        'email': emailCtrl.text.trim(),
        'password': passCtrl.text,
        'name': '${nameCtrl.text.trim()} ${surnameCtrl.text.trim()}',
        'address': '',
      });
      // volta para login
      setState(() {
        isLogin = true;
        errorMessage = null;
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cadastro realizado. Faça login.')),
      );
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screen = MediaQuery.of(context).size;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: screen.height - MediaQuery.of(context).padding.vertical - 24),
            child: IntrinsicHeight(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      'assets/images/login_image.png',
                      height: 160,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Logo
                  Center(
                    child: InkWell(
                      onTap: () => context.go('/landing'),
                      child: Image.asset(
                        'assets/images/logo.png',
                        height: 72,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: () => setState(() {
                          isLogin = true;
                          errorMessage = null;
                        }),
                        child: Text(
                          'Entrar',
                          style: theme.textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: isLogin ? const Color(0xFF0B1B52) : Colors.grey,
                          ),
                        ),
                      ),
                      Container(
                        width: 1,
                        height: 24,
                        margin: const EdgeInsets.symmetric(horizontal: 12),
                        color: Colors.black,
                      ),
                      GestureDetector(
                        onTap: () => setState(() {
                          isLogin = false;
                          errorMessage = null;
                        }),
                        child: Text(
                          'Cadastrar',
                          style: theme.textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: !isLogin ? const Color(0xFF0B1B52) : Colors.grey,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      StyledInput(
                        controller: emailCtrl,
                        hintText: 'E-MAIL',
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 12),
                      StyledInput(
                        controller: passCtrl,
                        hintText: 'SENHA',
                        obscureText: true,
                      ),
                      if (!isLogin) ...[
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: StyledInput(
                                controller: nameCtrl,
                                hintText: 'NOME',
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: StyledInput(
                                controller: surnameCtrl,
                                hintText: 'SOBRENOME',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Checkbox(
                              value: acceptedTerms,
                              onChanged: (v) => setState(() => acceptedTerms = v ?? false),
                            ),
                            const SizedBox(width: 8),
                            const Expanded(
                              child: Text(
                                'Aceito os termos e condições para a utilização dos meus dados',
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),

                  // Erro
                  if (errorMessage != null && errorMessage!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    ErrorBox(message: errorMessage),
                  ],

                  const Spacer(),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isLoading
                          ? null
                          : () {
                              if (isLogin) {
                                _sendLogin();
                              } else {
                                _sendRegister();
                              }
                            },
                      child: isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : Text(isLogin ? 'Entrar' : 'Cadastrar'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

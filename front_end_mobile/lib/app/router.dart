import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/landing/ui/landing_page.dart';
import '../features/auth/ui/login_page.dart';
import '../features/dashboard/ui/dashboard_page.dart';
import '../features/profile/ui/profile_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/landing',
    routes: [
      GoRoute(path: '/landing', builder: (_, __) => const LandingPage()),
      GoRoute(path: '/login', builder:    (_, __) => const LoginPage()),
      GoRoute(path: '/dashboard', builder: (_, __) => const DashboardPage()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
    ],
  );
});

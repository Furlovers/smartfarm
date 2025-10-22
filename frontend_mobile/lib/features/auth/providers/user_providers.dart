import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/http/token_storage.dart';
import '../../../core/http/user_storage.dart';
import '../models/user_models.dart';
import '../services/user_service.dart';

final userViewProvider =
    AsyncNotifierProvider<UserViewController, UserView?>(UserViewController.new);

class UserViewController extends AsyncNotifier<UserView?> {
  @override
  Future<UserView?> build() async {
    final token = await TokenStorage.instance.getToken();
    final userId = await UserStorage.instance.getUserId();
    if (token != null && token.isNotEmpty && userId != null && userId.isNotEmpty) {
      try {
        final view = await UserService.instance.fetchUserView(userId);
        _updateDashboardFilters(view);
        return view;
      } catch (e) {
        await UserService.instance.logout();
        return null;
      }
    }
    return null;
  }

  Future<bool> login({required String email, required String password}) async {
    state = const AsyncLoading();
    try {
      final auth = await UserService.instance.login(email: email, password: password);
      final view = await UserService.instance.fetchUserView(auth.userId);
      _updateDashboardFilters(view);
      state = AsyncData(view);
      return true; 
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> payload) async {
    try {
      final res = await UserService.instance.register(payload);
      return res;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> fetchUserData() async {
    final userId = await UserStorage.instance.getUserId();
    if (userId == null || userId.isEmpty) {
      state = const AsyncData(null);
      return;
    }
    state = const AsyncLoading();
    try {
      final view = await UserService.instance.fetchUserView(userId);
      _updateDashboardFilters(view);
      state = AsyncData(view);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> updateProfile(Map<String, dynamic> payload) async {
    final userId = await UserStorage.instance.getUserId();
    if (userId == null) return;
    state = const AsyncLoading();
    try {
      final updated = await UserService.instance.updateProfile(userId, payload);
      _updateDashboardFilters(updated);
      state = AsyncData(updated);
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<void> deleteUser() async {
    final userId = await UserStorage.instance.getUserId();
    if (userId == null) return;
    state = const AsyncLoading();
    try {
      await UserService.instance.deleteUser(userId);
      state = const AsyncData(null);
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<void> logout() async {
    await UserService.instance.logout();
    state = const AsyncData(null);
  }

  void _updateDashboardFilters(UserView view) {

    if (view.sensorList.isEmpty) {
      ref.read(dashboardFilterProvider.notifier).setRange(null, null);
      return;
    }
    final readings = view.sensorList.first.readingList;
    if (readings.isEmpty) {
      ref.read(dashboardFilterProvider.notifier).setRange(null, null);
      return;
    }
    final first = readings.first;
    final last = readings.last;
    ref.read(dashboardFilterProvider.notifier).setRange(first, last);
  }
}

final userErrorProvider = Provider<String?>((ref) {
  final state = ref.watch(userViewProvider);
  return state.hasError ? state.error.toString() : null;
});

// ---- Filtros do Dashboard ----
final dashboardFilterProvider =
    NotifierProvider<DashboardFilterController, DashboardFilter?>(DashboardFilterController.new);

class DashboardFilter {
  final Reading? start;
  final Reading? end;
  const DashboardFilter({required this.start, required this.end});
}

class DashboardFilterController extends Notifier<DashboardFilter?> {
  @override
  DashboardFilter? build() => null;

  void setRange(Reading? start, Reading? end) {
    state = DashboardFilter(start: start, end: end);
  }
}

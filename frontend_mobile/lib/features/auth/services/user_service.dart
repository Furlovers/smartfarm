import '../../../core/http/api_clients.dart';
import '../../../core/http/token_storage.dart';
import '../../../core/http/user_storage.dart';
import '../models/user_models.dart';

class UserService {
  UserService._();
  static final instance = UserService._();

  // POST /login
  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    final res = await userApi.post('/login', data: {
      'email': email,
      'password': password,
    });
    final auth = AuthResponse.fromJson(Map<String, dynamic>.from(res.data));
    await TokenStorage.instance.setToken(auth.token);
    await UserStorage.instance.setUserId(auth.userId);
    return auth;
  }

  // POST /register
  Future<Map<String, dynamic>> register(Map<String, dynamic> payload) async {
    final res = await userApi.post('/register', data: payload);
    return Map<String, dynamic>.from(res.data);
  }

  // GET /get_user_view/:userId
  Future<UserView> fetchUserView(String userId) async {
    final res = await viewApi.get('/get_user_view/$userId');
    return UserView.fromJson(Map<String, dynamic>.from(res.data));
  }

  // PUT /:userId
  Future<UserView> updateProfile(String userId, Map<String, dynamic> payload) async {
    final res = await userApi.put('/$userId', data: payload);

    try {
      final maybeView = UserView.fromJson(Map<String, dynamic>.from(res.data));
      return maybeView;
    } catch (_) {
      return fetchUserView(userId);
    }
  }

  // DELETE /:userId
  Future<void> deleteUser(String userId) async {
    await userApi.delete('/$userId');
    await logout();
  }

  Future<void> logout() async {
    await TokenStorage.instance.clear();
    await UserStorage.instance.clear();
  }
}

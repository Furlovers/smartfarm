import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  TokenStorage._();
  static final instance = TokenStorage._();

  static const _key = 'token';

  String? _cached;

  Future<String?> getToken() async {
    if (_cached != null) return _cached;
    final prefs = await SharedPreferences.getInstance();
    _cached = prefs.getString(_key);
    return _cached;
    }

  Future<void> setToken(String? token) async {
    final prefs = await SharedPreferences.getInstance();
    _cached = token;
    if (token == null) {
      await prefs.remove(_key);
    } else {
      await prefs.setString(_key, token);
    }
  }

  Future<void> clear() => setToken(null);
}

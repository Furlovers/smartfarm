import 'package:shared_preferences/shared_preferences.dart';

class UserStorage {
  UserStorage._();
  static final instance = UserStorage._();

  static const _keyUserId = 'userId';
  String? _cached;

  Future<String?> getUserId() async {
    if (_cached != null) return _cached;
    final prefs = await SharedPreferences.getInstance();
    _cached = prefs.getString(_keyUserId);
    return _cached;
  }

  Future<void> setUserId(String? userId) async {
    final prefs = await SharedPreferences.getInstance();
    _cached = userId;
    if (userId == null) {
      await prefs.remove(_keyUserId);
    } else {
      await prefs.setString(_keyUserId, userId);
    }
  }

  Future<void> clear() => setUserId(null);
}

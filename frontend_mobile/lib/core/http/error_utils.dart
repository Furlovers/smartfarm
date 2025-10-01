import 'package:dio/dio.dart';

String backendMessage(Object error, {String fallback = 'Algo deu errado.'}) {
  if (error is DioException) {
    final data = error.response?.data;

    if (data is Map) {
      for (final k in ['message', 'error', 'detail', 'msg']) {
        final v = data[k];
        if (v is String && v.trim().isNotEmpty) return v;
      }
      for (final k in ['errors', 'messages']) {
        final v = data[k];
        if (v is List && v.isNotEmpty) {
          final first = v.first;
          if (first is String && first.trim().isNotEmpty) return first;
          if (first is Map) {
            final m = first['message'] ?? first['msg'] ?? first['detail'];
            if (m is String && m.trim().isNotEmpty) return m;
          }
        }
      }
    }

    if (data is String && data.trim().isNotEmpty) return data;
  }
  return fallback;
}

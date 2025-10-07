import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'token_storage.dart';
import 'error_utils.dart';

class HttpClientFactory {
  HttpClientFactory._();
  static final instance = HttpClientFactory._();

  // Cria uma instância do Dio configurada
  Dio create({required String baseUrl}) {
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ),
    );

    // Interceptor para adicionar token de autenticação em cada requisição
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await TokenStorage.instance.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          } else {
            options.headers.remove('Authorization');
          }
          handler.next(options);
        },
      ),
    );

  // Recebe a mensagem de erro do backend
  dio.interceptors.add(
  InterceptorsWrapper(
    onError: (e, handler) {
      final msg = backendMessage(e);
      final decorated = DioException(
        requestOptions: e.requestOptions,
        response: e.response,
        type: e.type,
        error: e.error,
        stackTrace: e.stackTrace,
        message: msg,
      );
      return handler.reject(decorated);
    },
  ),
);


    dio.interceptors.add(
      PrettyDioLogger(
        requestHeader: false,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        compact: true,
        maxWidth: 100,
      ),
    );

    return dio;
  }
}

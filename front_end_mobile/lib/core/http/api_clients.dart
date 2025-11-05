import 'package:dio/dio.dart';
import '../config/env.dart';
import 'http_client.dart';

final Dio userApi    = HttpClientFactory.instance.create(baseUrl: Env.usersBaseUrl);
final Dio sensorApi  = HttpClientFactory.instance.create(baseUrl: Env.sensorsBaseUrl);
final Dio readingApi = HttpClientFactory.instance.create(baseUrl: Env.readingsBaseUrl);
final Dio viewApi    = HttpClientFactory.instance.create(baseUrl: Env.viewBaseUrl);

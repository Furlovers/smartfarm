import 'package:dio/dio.dart';
import '../../../core/http/api_clients.dart';
import '../../auth/models/user_models.dart';

class SensorService {
  SensorService._();
  static final instance = SensorService._();

  // POST /
  Future<Sensor> createSensor(Map<String, dynamic> payload) async {
    final res = await sensorApi.post('/', data: payload);
    return Sensor.fromJson(Map<String, dynamic>.from(res.data));
  }

  // DELETE /:sensorId
  Future<void> deleteSensor(String sensorId) async {
    await sensorApi.delete('/$sensorId');
  }
}

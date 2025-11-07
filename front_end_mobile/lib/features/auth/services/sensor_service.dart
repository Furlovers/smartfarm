import '../../../core/http/api_clients.dart';
import '../models/user_models.dart';

class SensorService {
  SensorService._();
  static final instance = SensorService._();

  Future<Sensor> createSensor(Map<String, dynamic> payload) async {
    final res = await sensorApi.post('/', data: payload);
    return Sensor.fromJson(Map<String, dynamic>.from(res.data));
  }


  Future<void> deleteSensor(String sensorId) async {
    await sensorApi.delete('/$sensorId');
  }
}

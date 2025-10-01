import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/sensor_service.dart';
import '../../auth/models/user_models.dart';

final sensorListProvider =
    NotifierProvider<SensorListController, AsyncValue<List<Sensor>>>(SensorListController.new);

class SensorListController extends Notifier<AsyncValue<List<Sensor>>> {
  @override
  AsyncValue<List<Sensor>> build() {
    return const AsyncData(<Sensor>[]);
  }

  Future<void> seedFromUserView(List<Sensor> sensors) async {
    state = AsyncData(List<Sensor>.from(sensors));
  }

  Future<void> createSensor(Map<String, dynamic> payload) async {
    state = const AsyncLoading();
    try {
      final sensor = await SensorService.instance.createSensor(payload);
      final current = state.valueOrNull ?? <Sensor>[];
      state = AsyncData([...current, sensor]);
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<void> deleteSensor(String sensorId) async {
    state = const AsyncLoading();
    try {
      await SensorService.instance.deleteSensor(sensorId);
      final current = state.valueOrNull ?? <Sensor>[];
      state = AsyncData(current.where((s) => s.id != sensorId).toList());
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }
}

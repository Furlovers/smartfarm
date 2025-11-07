import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../auth/models/user_models.dart';
import '../../auth/providers/user_providers.dart';
import '../core/metrics.dart';

final dashboardStateProvider =
    NotifierProvider<DashboardStateController, DashboardState>(DashboardStateController.new);

class DashboardState {
  final MetricType metric;
  final String? selectedSensorId;
  const DashboardState({required this.metric, required this.selectedSensorId});

  DashboardState copyWith({MetricType? metric, String? selectedSensorId}) =>
      DashboardState(metric: metric ?? this.metric, selectedSensorId: selectedSensorId ?? this.selectedSensorId);
}

class DashboardStateController extends Notifier<DashboardState> {
  @override
  DashboardState build() {
    final view = ref.read(userViewProvider).valueOrNull;
    final firstId = view?.sensorList.isNotEmpty == true ? view!.sensorList.first.id : null;
    return DashboardState(metric: MetricType.temperature, selectedSensorId: firstId);
  }

  void setMetric(MetricType m) => state = state.copyWith(metric: m);
  void selectSensor(String? id) => state = state.copyWith(selectedSensorId: id);
}

final userViewDataProvider = Provider<UserView?>((ref) {
  return ref.watch(userViewProvider).valueOrNull;
});

final selectedSensorProvider = Provider<Sensor?>((ref) {
  final view = ref.watch(userViewDataProvider);
  final id = ref.watch(dashboardStateProvider.select((s) => s.selectedSensorId));
  final sensors = view?.sensorList ?? const <Sensor>[];

  if (sensors.isEmpty || id == null) return null;

  for (final s in sensors) {
    if (s.id == id) return s;
  }
  return null;
});

final recentTimeFormatterProvider = Provider<DateFormat>((_) => DateFormat('dd/MM HH:mm:ss'));

final last24hReadingsProvider = Provider<List<Reading>>((ref) {
  final sensor = ref.watch(selectedSensorProvider);
  final metric = ref.watch(dashboardStateProvider.select((s) => s.metric));
  if (sensor == null) return const [];
  final now = DateTime.now();
  final start = now.subtract(const Duration(hours: 24));
  final readings = sensor.readingList
      .where((r) => r.timestamp.isAfter(start) && valueFor(r, metric) != null)
      .toList()
    ..sort((a, b) => a.timestamp.compareTo(b.timestamp));
  return readings;
});

class MetricStats {
  final double? current;
  final double? avg;
  final double? min;
  final double? max;
  const MetricStats({this.current, this.avg, this.min, this.max});
}

final metricStatsProvider = Provider<MetricStats>((ref) {
  final metric = ref.watch(dashboardStateProvider.select((s) => s.metric));
  final reads = ref.watch(lastNReadingsProvider(10)); // << aqui muda
  if (reads.isEmpty) return const MetricStats();

  final vals = reads.map((r) => valueFor(r, metric)!).toList();
  final current = vals.last;
  final avg = vals.reduce((a, b) => a + b) / vals.length;
  final min = vals.reduce((a, b) => a < b ? a : b);
  final max = vals.reduce((a, b) => a > b ? a : b);
  return MetricStats(current: current, avg: avg, min: min, max: max);
});


final timeFormatterProvider = Provider<DateFormat>((_) => DateFormat.Hm());

final lastNReadingsProvider = Provider.family<List<Reading>, int>((ref, n) {
  final sensor = ref.watch(selectedSensorProvider);
  final metric = ref.watch(dashboardStateProvider.select((s) => s.metric));
  if (sensor == null || sensor.readingList.isEmpty) return const <Reading>[];

  final all = sensor.readingList
      .where((r) => valueFor(r, metric) != null)
      .toList()
    ..sort((a, b) => a.timestamp.compareTo(b.timestamp));

  final start = (all.length - n).clamp(0, all.length);
  return all.sublist(start);
});

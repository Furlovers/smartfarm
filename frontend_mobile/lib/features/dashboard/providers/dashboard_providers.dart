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

// Sensor selecionado
final selectedSensorProvider = Provider<Sensor?>((ref) {
  final view = ref.watch(userViewDataProvider);
  final id = ref.watch(dashboardStateProvider.select((s) => s.selectedSensorId));
  return view?.sensorList.firstWhere(
    (s) => s.id == id,
    // ignore: cast_from_null_always_fails
    orElse: () => (view.sensorList.isNotEmpty) ? view.sensorList.first : (null as Sensor),
  );
});

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
  final reads = ref.watch(last24hReadingsProvider);
  if (reads.isEmpty) return const MetricStats();

  double? last = valueFor(reads.last, metric);
  final vals = reads.map((r) => valueFor(r, metric)!).toList();
  final sum = vals.fold<double>(0, (a, b) => a + b);
  final avg = vals.isNotEmpty ? (sum / vals.length) : null;
  final min = vals.reduce((a, b) => a < b ? a : b);
  final max = vals.reduce((a, b) => a > b ? a : b);
  return MetricStats(current: last, avg: avg, min: min, max: max);
});

final timeFormatterProvider = Provider<DateFormat>((_) => DateFormat.Hm());

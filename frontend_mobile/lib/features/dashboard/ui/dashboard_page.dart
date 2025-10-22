import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/providers/user_providers.dart';
import '../../auth/models/user_models.dart';
import '../core/metrics.dart';
import '../providers/dashboard_providers.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userViewProvider);

    return userAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Erro ao carregar: $e')),
      data: (view) => view == null
          ? const Center(child: Text('Faça login para ver seu dashboard.'))
          : const _DashboardContent(),
    );
  }
}

class _DashboardContent extends ConsumerWidget {
  const _DashboardContent();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final view = ref.watch(userViewDataProvider)!;
    final state = ref.watch(dashboardStateProvider);
    final metric = state.metric;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            tooltip: 'Perfil',
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.go('/profile'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(userViewProvider.notifier).fetchUserData();
        },
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
          children: [
            _MetricSelector(
              selected: metric,
              onSelect: (m) => ref.read(dashboardStateProvider.notifier).setMetric(m),
            ),
            const SizedBox(height: 12),
            _SensorChips(
              sensors: view.sensorList,
              selectedId: state.selectedSensorId,
              onSelect: (id) => ref.read(dashboardStateProvider.notifier).selectSensor(id),
            ),
            const SizedBox(height: 12),
            const _StatCardsRow(),
            const SizedBox(height: 12),
            const _MiniChart(),
            const SizedBox(height: 12),
            const _RecentReadings(),
          ],
        ),
      ),
    );
  }
}

class _MetricSelector extends StatelessWidget {
  final MetricType selected;
  final ValueChanged<MetricType> onSelect;
  const _MetricSelector({required this.selected, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    const items = MetricType.values;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: items.map((m) {
          final info = metricInfo[m]!;
          final sel = m == selected;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(info.icon, size: 18),
                  const SizedBox(width: 6),
                  Text(info.label),
                ],
              ),
              selected: sel,
              onSelected: (_) => onSelect(m),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _SensorChips extends StatelessWidget {
  final List<Sensor> sensors;
  final String? selectedId;
  final ValueChanged<String?> onSelect;
  const _SensorChips({required this.sensors, required this.selectedId, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    if (sensors.isEmpty) {
      return const Text('Nenhum sensor cadastrado.');
    }
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: sensors.map((s) {
          final sel = s.id == selectedId;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(s.name),
              selected: sel,
              onSelected: (_) => onSelect(s.id),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _StatCardsRow extends ConsumerWidget {
  const _StatCardsRow();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final metric = ref.watch(dashboardStateProvider.select((s) => s.metric));
    final info = metricInfo[metric]!;
    final stats = ref.watch(metricStatsProvider);

    String fmt(double? v) => v == null ? '--' : '${v.toStringAsFixed(2)} ${info.unit}';

    return Row(
      children: [
        Expanded(child: _StatCard(label: 'Atual', value: fmt(stats.current), icon: info.icon)),
        const SizedBox(width: 8),
        Expanded(child: _StatCard(label: 'Média 24h', value: fmt(stats.avg), icon: Icons.trending_flat)),
        const SizedBox(width: 8),
        Expanded(child: _StatCard(label: 'Mín 24h', value: fmt(stats.min), icon: Icons.south)),
        const SizedBox(width: 8),
        Expanded(child: _StatCard(label: 'Máx 24h', value: fmt(stats.max), icon: Icons.north)),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  const _StatCard({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18),
            const SizedBox(height: 6),
            Text(label, style: Theme.of(context).textTheme.labelMedium),
            const SizedBox(height: 4),
            Text(value, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}

class _MiniChart extends ConsumerWidget {
  const _MiniChart();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final metric = ref.watch(dashboardStateProvider.select((s) => s.metric));
    final info = metricInfo[metric]!;
    final reads = ref.watch(last24hReadingsProvider);

    if (reads.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Text('Sem dados nas últimas 24h para ${info.label}.'),
        ),
      );
    }

    final firstTs = reads.first.timestamp.millisecondsSinceEpoch.toDouble();
    final spots = reads
        .map((r) => FlSpot(
              (r.timestamp.millisecondsSinceEpoch.toDouble() - firstTs) / 3600000.0, // horas desde o início
              valueFor(r, metric)!,
            ))
        .toList();

    return Card(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 16, 12, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${info.label} — últimas 24h', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            SizedBox(
              height: 160,
              child: LineChart(
                LineChartData(
                  titlesData: FlTitlesData(
                    leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 22,
                        interval: 6, // de 6 em 6 horas
                        getTitlesWidget: (v, meta) => Padding(
                          padding: const EdgeInsets.only(top: 6),
                          child: Text('${v.toInt()}h', style: const TextStyle(fontSize: 10)),
                        ),
                      ),
                    ),
                  ),
                  gridData: const FlGridData(show: false),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: spots,
                      isCurved: true,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(show: true, applyCutOffY: false),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RecentReadings extends ConsumerWidget {
  const _RecentReadings();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final metric = ref.watch(dashboardStateProvider.select((s) => s.metric));
    final info = metricInfo[metric]!;
    final reads = ref.watch(last24hReadingsProvider).reversed.take(10).toList();
    final fmt = ref.watch(timeFormatterProvider);

    if (reads.isEmpty) return const SizedBox.shrink();

    String fmtVal(double? v) => v == null ? '--' : '${v.toStringAsFixed(2)} ${info.unit}';

    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Leituras recentes', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ...reads.map((r) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    children: [
                      Icon(info.icon, size: 16),
                      const SizedBox(width: 8),
                      Expanded(child: Text(fmt.format(r.timestamp))),
                      Text(fmtVal(valueFor(r, metric))),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }
}

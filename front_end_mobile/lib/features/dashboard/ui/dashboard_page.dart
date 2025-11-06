import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/services.dart';

import '../../auth/providers/user_providers.dart';
import '../../auth/models/user_models.dart';
import '../core/metrics.dart';
import '../providers/dashboard_providers.dart';
import '../../auth/providers/sensor_providers.dart';

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
      floatingActionButton: const _AddSensorFab(), 
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

class _AddSensorFab extends ConsumerWidget {
  const _AddSensorFab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FloatingActionButton(
      tooltip: 'Adicionar sensor',
      child: const Icon(Icons.add),
      onPressed: () async {
        final created = await showDialog<Sensor?>(
          context: context,
          builder: (_) => const _CreateSensorDialog(),
        );

        if (created != null) {
          // seleciona automaticamente o novo sensor
          ref.read(dashboardStateProvider.notifier).selectSensor(created.id);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Sensor criado com sucesso.')),
          );
        }
      },
    );
  }
}

class _CreateSensorDialog extends ConsumerStatefulWidget {
  const _CreateSensorDialog();

  @override
  ConsumerState<_CreateSensorDialog> createState() => _CreateSensorDialogState();
}

class _CreateSensorDialogState extends ConsumerState<_CreateSensorDialog> {
  final _formKey = GlobalKey<FormState>();

  final _nameCtrl = TextEditingController();
  final _latCtrl  = TextEditingController();
  final _lngCtrl  = TextEditingController();

  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _latCtrl.dispose();
    _lngCtrl.dispose();
    super.dispose();
  }

  double? _parseNullableDouble(String text) {
    final t = text.trim();
    if (t.isEmpty) return null;
    // Suporta vírgula decimal
    return double.tryParse(t.replaceAll(',', '.'));
  }

  String? _validateLat(String? v) {
    if (v == null || v.trim().isEmpty) return null;
    final d = _parseNullableDouble(v);
    if (d == null) return 'Informe um número válido';
    if (d < -90 || d > 90) return 'Latitude deve estar entre -90 e 90';
    return null;
  }

  String? _validateLng(String? v) {
    if (v == null || v.trim().isEmpty) return null;
    final d = _parseNullableDouble(v);
    if (d == null) return 'Informe um número válido';
    if (d < -180 || d > 180) return 'Longitude deve estar entre -180 e 180';
    return null;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      final lat = _parseNullableDouble(_latCtrl.text);
      final lng = _parseNullableDouble(_lngCtrl.text);

      final payload = <String, dynamic>{
        'name': _nameCtrl.text.trim(),
        if (lat != null) 'latitude': lat,
        if (lng != null) 'longitude': lng,
      };

      await ref.read(sensorListProvider.notifier).createSensor(payload);

      await ref.read(userViewProvider.notifier).fetchUserData();

      final updatedView = ref.read(userViewDataProvider);
      final newSensor = (updatedView?.sensorList.isNotEmpty ?? false)
          ? updatedView!.sensorList.last
          : null;

      if (!mounted) return;
      Navigator.of(context).pop(newSensor);
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Novo sensor'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: 'Nome do sensor *',
                hintText: 'Ex.: Sensor A',
              ),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Informe um nome' : null,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _latCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Latitude (opcional)',
                      helperText: '-90 a 90',
                    ),
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true, signed: true),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp(r'^-?\d*[,\.]?\d{0,6}$')),
                    ],
                    validator: _validateLat,
                    textInputAction: TextInputAction.next,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _lngCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Longitude (opcional)',
                      helperText: '-180 a 180',
                    ),
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true, signed: true),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp(r'^-?\d*[,\.]?\d{0,6}$')),
                    ],
                    validator: _validateLng,
                    textInputAction: TextInputAction.done,
                    onFieldSubmitted: (_) => _submit(),
                  ),
                ),
              ],
            ),
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(_error!, style: const TextStyle(color: Colors.red)),
            ],
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: _saving ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: _saving ? null : _submit,
          child: _saving
              ? const SizedBox(
                  height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
              : const Text('Criar'),
        ),
      ],
    );
  }
}

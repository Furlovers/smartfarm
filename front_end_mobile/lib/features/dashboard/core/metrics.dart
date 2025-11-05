import 'package:flutter/material.dart';
import '../../auth/models/user_models.dart';

enum MetricType { temperature, humidity, ph, luminosity }

class MetricInfo {
  final String label;
  final String unit;
  final IconData icon;
  const MetricInfo(this.label, this.unit, this.icon);
}

const metricInfo = {
  MetricType.temperature: MetricInfo('Temperatura', '°C', Icons.thermostat),
  MetricType.humidity:    MetricInfo('Umidade',      '%',  Icons.water_drop),
  MetricType.ph:          MetricInfo('pH',           '',   Icons.science),
  MetricType.luminosity:  MetricInfo('Luminosidade', 'lx', Icons.wb_sunny),
};

double? valueFor(Reading r, MetricType m) {
  switch (m) {
    case MetricType.temperature: return r.temperature;
    case MetricType.humidity:    return r.humidity;
    case MetricType.ph:          return r.ph;
    case MetricType.luminosity:  return r.luminosity;
  }
}

class Reading {
  final DateTime timestamp;
  final double? temperature;
  final double? humidity;
  final double? luminosity;
  final double? ph;

  Reading({
    required this.timestamp,
    this.temperature,
    this.humidity,
    this.luminosity,
    this.ph,
  });

  factory Reading.fromJson(Map<String, dynamic> json) {
    final ts = _parseTimestamp(
      json['timestamp'] ?? json['ts'] ?? json['createdAt'] ?? json['date'],
    );

    return Reading(
      timestamp: ts,
      temperature: (json['temperature'] as num?)?.toDouble(),
      humidity: (json['humidity'] as num?)?.toDouble(),
      luminosity: (json['luminosity'] as num?)?.toDouble(),
      ph: (json['ph'] as num?)?.toDouble(),
    );
  }

  static DateTime _parseTimestamp(dynamic v) {
    if (v == null) {
      return DateTime.fromMillisecondsSinceEpoch(0, isUtc: true);
    }
    if (v is int) {
      final ms = v < 1000000000000 ? v * 1000 : v;
      return DateTime.fromMillisecondsSinceEpoch(ms, isUtc: true);
    }
    if (v is num) {
      final iv = v.toInt();
      final ms = iv < 1000000000000 ? iv * 1000 : iv;
      return DateTime.fromMillisecondsSinceEpoch(ms, isUtc: true);
    }
    if (v is String) {
      final asInt = int.tryParse(v);
      if (asInt != null) {
        final ms = asInt < 1000000000000 ? asInt * 1000 : asInt;
        return DateTime.fromMillisecondsSinceEpoch(ms, isUtc: true);
      }
      final parsed = DateTime.tryParse(v);
      if (parsed != null) {
        return parsed.isUtc ? parsed : parsed.toUtc();
      }
    }
    return DateTime.fromMillisecondsSinceEpoch(0, isUtc: true);
  }
}


class Sensor {
  final String id;
  final String name;
  final double? lat;
  final double? lng;
  final List<Reading> readingList;

  Sensor({
    required this.id,
    required this.name,
    this.lat,
    this.lng,
    required this.readingList,
  });

  factory Sensor.fromJson(Map<String, dynamic> json) => Sensor(
        id: (json['id'] ?? json['_id'] ?? '').toString(),
        name: (json['name'] ?? json['sensorName'] ?? 'Sensor').toString(),
        lat: (json['lat'] as num?)?.toDouble() ?? (json['latitude'] as num?)?.toDouble(),
        lng: (json['lng'] as num?)?.toDouble() ?? (json['longitude'] as num?)?.toDouble(),
        readingList: (json['readingList'] ?? json['readings'] ?? const [])
            .map<Reading>((e) => Reading.fromJson(Map<String, dynamic>.from(e)))
            .toList(),
      );
}

class UserView {
  final String userId;
  final String? email;
  final String? name;
  final List<Sensor> sensorList;
  final String? address;
  final DateTime? dateOfJoining;
  final String role;

  UserView({
    required this.userId,
    this.email,
    this.name,
    required this.sensorList,
    this.address,
    this.dateOfJoining,
    required this.role,
  });

  factory UserView.fromJson(Map<String, dynamic> json) => UserView(
        userId: (json['userId'] ?? json['id'] ?? json['_id'] ?? '').toString(),
        email: json['email']?.toString(),
        name: json['name']?.toString(),
        sensorList: (json['sensorList'] ?? json['sensors'] ?? const [])
            .map<Sensor>((e) => Sensor.fromJson(Map<String, dynamic>.from(e)))
            .toList(),
        address: json['address']?.toString(),
        dateOfJoining: DateTime.tryParse(json['dateOfJoining']?.toString() ?? ''),
        role: (json['role'] ?? '').toString(),
      );
}

class AuthResponse {
  final String token;
  final String userId;

  AuthResponse({required this.token, required this.userId});

  factory AuthResponse.fromJson(Map<String, dynamic> json) => AuthResponse(
        token: (json['token'] ?? '').toString(),
        userId: (json['user']?['userId'] ?? json['userId'] ?? json['id'] ?? '').toString(),
      );
}

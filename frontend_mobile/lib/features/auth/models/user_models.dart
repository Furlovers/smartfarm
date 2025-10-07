class Reading {
  final String id;
  final DateTime timestamp;
  final double? ph;
  final double? temperature;
  final double? humidity;
  final double? luminosity;

  Reading({
    required this.id,
    required this.timestamp,
    this.ph,
    this.temperature,
    this.humidity,
    this.luminosity,
  });

  factory Reading.fromJson(Map<String, dynamic> json) => Reading(
        id: (json['id'] ?? json['_id'] ?? '').toString(),
        timestamp: DateTime.tryParse(json['timestamp']?.toString() ?? '') ??
            DateTime.fromMillisecondsSinceEpoch(
              (json['ts'] ?? json['time'] ?? DateTime.now().millisecondsSinceEpoch),
              isUtc: false,
            ),
        ph: (json['ph'] as num?)?.toDouble(),
        temperature: (json['temperature'] as num?)?.toDouble(),
        humidity: (json['humidity'] as num?)?.toDouble(),
        luminosity: (json['luminosity'] as num?)?.toDouble(),
      );
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

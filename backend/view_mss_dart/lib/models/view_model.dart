class Reading {
  String readingId;
  num battery;
  num temperature;
  num humidity;
  num pH;
  num luminosity;
  int createdAt; 

  Reading({
    required this.readingId,
    required this.battery,
    required this.temperature,
    required this.humidity,
    required this.pH,
    required this.luminosity,
    required this.createdAt,
  });

  factory Reading.fromJson(Map<String, dynamic> json) {
    return Reading(
      readingId: json['readingId'],
      battery: json['battery'],
      temperature: json['temperature'],
      humidity: json['humidity'],
      pH: json['pH'],
      luminosity: json['luminosity'],
      createdAt: json['createdAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'readingId': readingId,
      'battery': battery,
      'temperature': temperature,
      'humidity': humidity,
      'pH': pH,
      'luminosity': luminosity,
      'createdAt': createdAt,
    };
  }
}

class Sensor {
  String sensorId;
  String name;
  num latitude;
  num longitude;
  int createdAt;
  List<Reading> readingList;

  Sensor({
    required this.sensorId,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.createdAt,
    required this.readingList,
  });

  factory Sensor.fromJson(Map<String, dynamic> json) {
    return Sensor(
      sensorId: json['sensorId'],
      name: json['name'],
      latitude: json['latitude'],
      longitude: json['longitude'],
      createdAt: json['createdAt'],
      readingList: (json['readingList'] as List)
          .map((item) => Reading.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sensorId': sensorId,
      'name': name,
      'latitude': latitude,
      'longitude': longitude,
      'createdAt': createdAt,
      'readingList': readingList.map((item) => item.toJson()).toList(),
    };
  }
}

class View {
  String userId;
  String name;
  String email;
  String password;
  String role;
  String? address;
  int dateOfJoining;
  List<Sensor> sensorList;

  View({
    required this.userId,
    required this.name,
    required this.email,
    required this.password,
    required this.role,
    this.address,
    required this.dateOfJoining,
    required this.sensorList,
  });

  factory View.fromJson(Map<String, dynamic> json) {
    return View(
      userId: json['userId'],
      name: json['name'],
      email: json['email'],
      password: json['password'],
      role: json['role'] ?? 'user-basic',
      address: json['address'],
      dateOfJoining: json['dateOfJoining'],
      sensorList: (json['sensorList'] as List)
          .map((item) => Sensor.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'name': name,
      'email': email,
      'password': password,
      'role': role,
      'address': address,
      'dateOfJoining': dateOfJoining,
      'sensorList': sensorList.map((item) => item.toJson()).toList(),
    };
  }
}
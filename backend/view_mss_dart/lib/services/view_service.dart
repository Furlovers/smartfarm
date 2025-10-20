import 'package:mongo_dart/mongo_dart.dart';
import 'package:uuid/uuid.dart';
import '../config/db.dart'; 
import '../models/view_model.dart';

final _uuid = Uuid();

final _defaultReading = {
  'battery': 0,
  'temperature': 0,
  'humidity': 0,
  'pH': 0,
  'luminosity': 0,
  'createdAt': DateTime.now().millisecondsSinceEpoch,
  'readingId': _uuid.v4(),
};

final _defaultSensor = {
  'name': "undefined",
  'latitude': 0,
  'longitude': 0,
  'createdAt': DateTime.now().millisecondsSinceEpoch,
  'readingList': [_defaultReading],
  'sensorId': _uuid.v4(),
};

Future<void> createUser(Map<String, dynamic> data) async {
  try {
    final newUser = {
      'name': data['name'],
      'email': data['email'],
      'password': data['password'],
      'userId': data['userId'],
      'dateOfJoining': data['dateOfJoining'],
      'role': data['role'] ?? 'user-basic',
      'address': data['address'] ?? "",
      'sensorList': [_defaultSensor],
    };
    await viewCollection.insertOne(newUser);
  } catch (err) {
    print("Error creating user: $err");
    throw Exception(err.toString());
  }
}

Future<void> updateUser(String userId, Map<String, dynamic> data) async {
  try {
    await viewCollection.updateOne(
      where.eq('userId', userId),
      modify
          .set('name', data['name'])
          .set('email', data['email'])
          .set('password', data['password'])
          .set('role', data['role'])
          .set('address', data['address'] ?? ""),
    );
  } catch (err) {
    print("Error updating user: $err");
    throw Exception(err.toString());
  }
}

Future<void> deleteUser(String userId) async {
  try {
    final result = await viewCollection.deleteOne(where.eq('userId', userId));
    if (result.nRemoved == 0) {
      throw Exception("Usuário não encontrado");
    }
  } catch (err) {
    print("Error deleting user: $err");
    throw Exception(err.toString());
  }
}

Future<void> createSensor(String userId, Map<String, dynamic> sensorData) async {
  try {
    final newSensor = {
      'name': sensorData['name'],
      'latitude': sensorData['latitude'],
      'longitude': sensorData['longitude'],
      'createdAt': sensorData['createdAt'],
      'sensorId': sensorData['sensorId'],
      'readingList': [_defaultReading],
    };

    await viewCollection.updateOne(
      where.eq('userId', userId),
      modify.push('sensorList', newSensor),
    );
  } catch (err) {
    print("Error creating sensor: $err");
    throw Exception(err.toString());
  }
}

Future<void> updateSensor(String userId, Map<String, dynamic> sensorData) async {
  try {
    final modifier = modify;
    if (sensorData['name'] != null) {
      modifier.set('sensorList.\$.name', sensorData['name']);
    }
    if (sensorData['latitude'] != null) {
      modifier.set('sensorList.\$.latitude', sensorData['latitude']);
    }
    if (sensorData['longitude'] != null) {
      modifier.set('sensorList.\$.longitude', sensorData['longitude']);
    }
    if (sensorData['createdAt'] != null) {
      modifier.set('sensorList.\$.createdAt', sensorData['createdAt']);
    }

    await viewCollection.updateOne(
      where.eq('userId', userId).eq('sensorList.sensorId', sensorData['sensorId']),
      modifier,
    );
  } catch (err) {
    print("Error updating sensor: $err");
    throw Exception(err.toString());
  }
}

Future<void> deleteSensor(String userId, String sensorId) async {
  try {
    await viewCollection.updateOne(
      where.eq('userId', userId),
      modify.pull('sensorList', {'sensorId': sensorId}),
    );
  } catch (err) {
    print("Error deleting sensor: $err");
    throw Exception(err.toString());
  }
}

Future<void> createReading(
    String userId, String sensorId, Map<String, dynamic> readingData) async {
  try {
    final newReading = {
      'battery': readingData['battery'],
      'temperature': readingData['temperature'],
      'humidity': readingData['humidity'],
      'pH': readingData['pH'],
      'luminosity': readingData['luminosity'],
      'createdAt': readingData['createdAt'],
      'readingId': readingData['readingId'],
    };

    await viewCollection.updateOne(
      where.eq('userId', userId).eq('sensorList.sensorId', sensorId),
      modify.push('sensorList.\$.readingList', newReading),
    );
  } catch (err) {
    print("Error creating reading: $err");
    throw Exception(err.toString());
  }
}

Future<void> updateReading(String userId, String sensorId, String readingId,
    Map<String, dynamic> readingData) async {
  try {
    final modifier = modify;
    
    if (readingData['battery'] != null) {
      modifier.set(r'sensorList.$[sensor].readingList.$[reading].battery',
          readingData['battery']);
    }
    if (readingData['temperature'] != null) {
      modifier.set(r'sensorList.$[sensor].readingList.$[reading].temperature',
          readingData['temperature']);
    }
    if (readingData['humidity'] != null) {
      modifier.set(r'sensorList.$[sensor].readingList.$[reading].humidity',
          readingData['humidity']);
    }
    if (readingData['pH'] != null) {
      modifier.set(
          r'sensorList.$[sensor].readingList.$[reading].pH', readingData['pH']);
    }
    if (readingData['luminosity'] != null) {
      modifier.set(r'sensorList.$[sensor].readingList.$[reading].luminosity',
          readingData['luminosity']);
    }
    if (readingData['createdAt'] != null) {
      modifier.set(r'sensorList.$[sensor].readingList.$[reading].createdAt',
          readingData['createdAt']);
    }

    await viewCollection.updateOne(
      where.eq('userId', userId),
      modifier,
      arrayFilters: [
        {'sensor.sensorId': sensorId},
        {'reading.readingId': readingId}
      ],
    );
  } catch (err) {
    print("Error updating reading: $err");
    throw Exception(err.toString());
  }
}

Future<void> deleteReading(
    String userId, String sensorId, String readingId) async {
  try {
    await viewCollection.updateOne(
      where.eq('userId', userId).eq('sensorList.sensorId', sensorId),
      modify.pull('sensorList.\$.readingList', {'readingId': readingId}),
    );
  } catch (err) {
    print("Error deleting reading: $err");
    throw Exception(err.toString());
  }
}

Future<Map<String, dynamic>> getUserView(String userId) async {
  try {
    final userDoc = await viewCollection.findOne(where.eq('userId', userId));

    if (userDoc == null) {
      throw Exception("Usuário não encontrado");
    }

    final user = View.fromJson(userDoc);

    for (var sensor in user.sensorList) {
      if (sensor.readingList.isNotEmpty) {
        sensor.readingList.removeAt(0); 
      }
    }

    if (user.sensorList.isNotEmpty) {
      user.sensorList.removeAt(0);
    }

    return user.toJson();
  } catch (err) {
    print("Error getting user view: $err");
    throw Exception(err.toString());
  }
}
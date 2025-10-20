import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../services/view_service.dart' as service;

final eventRoutes = Router()
  ..post('/', _eventHandler); 

Future<Response> _eventHandler(Request request) async {
  try {
    final bodyString = await request.readAsString();
    final event = json.decode(bodyString) as Map<String, dynamic>;

    final String type = event['type'];
    final Map<String, dynamic>? data = event['data'];
    final Map<String, dynamic>? params = event['params'];

    switch (type) {
      case 'UserCreateView':
        await service.createUser(data!['user_data']);
        break;
      case 'UserUpdateView':
        await service.updateUser(params!['userId'], data!['user_data']);
        break;
      case 'UserDeleteView':
        await service.deleteUser(params!['userId']);
        break;
      case 'SensorCreateView':
        await service.createSensor(params!['userId'], data!['sensor_data']);
        break;
      case 'SensorUpdateView':
        await service.updateSensor(params!['userId'], data!['sensor_data']);
        break;
      case 'SensorDeleteView':
        await service.deleteSensor(params!['userId'], params['sensorId']);
        break;
      case 'ReadingCreateView':
        await service.createReading(
            params!['userId'], params['sensorId'], data!['reading_data']);
        break;
      case 'ReadingUpdateView':
        await service.updateReading(params!['userId'], params['sensorId'],
            params['readingId'], data!['reading_data']);
        break;
      case 'ReadingDeleteView':
        await service.deleteReading(
            params!['userId'], params['sensorId'], params['readingId']);
        break;
      default:
        print('Evento desconhecido: $type');
    }

    return Response.ok('Event processed');
  } catch (e) {
    print('Erro no manipulador de eventos: $e');
    return Response.internalServerError(body: 'Erro ao processar evento');
  }
}
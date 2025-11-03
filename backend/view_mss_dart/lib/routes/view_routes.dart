import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../services/view_service.dart' as service;

final viewRoutes = Router()
  ..get('/get_user_view/<userId>', _getUserView)
  ..put('/update_reading/<userId>/<sensorId>/<readingId>', _updateReading);

Future<Response> _getUserView(Request request, String userId) async {
  try {
    final userView = await service.getUserView(userId);
    return Response.ok(
      json.encode(userView),
      headers: {'Content-Type': 'application/json'},
    );
  } catch (e) {
    print('Erro em _getUserView: $e');
    if (e.toString().contains('Usuário não encontrado')) {
      return Response.notFound(e.toString()); 
    }
    return Response.internalServerError(body: e.toString());
  }
}

Future<Response> _updateReading(
    Request request, String userId, String sensorId, String readingId) async {
  try {
    final bodyString = await request.readAsString();
    final readingData = json.decode(bodyString) as Map<String, dynamic>;

    await service.updateReading(userId, sensorId, readingId, readingData);

    return Response.ok(
      json.encode({'message': 'Reading updated successfully'}),
      headers: {'Content-Type': 'application/json'},
    );
  } catch (e) {
    print('Erro em _updateReading: $e');
    return Response.internalServerError(body: e.toString());
  }
}
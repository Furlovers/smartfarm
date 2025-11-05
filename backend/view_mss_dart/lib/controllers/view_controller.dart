import 'dart:convert';
import 'package:shelf/shelf.dart';
import '../services/view_service.dart';

Future<Response> getUserView(Request request, String userId) async {
  try {
    final userView = await viewService.getUserView(userId);

    return Response.ok(
      jsonEncode(userView.toJson()),
      headers: {'content-type': 'application/json'},
    );
  } on Exception catch (e) {
    if (e.toString().contains('não encontrado')) {
      return Response.notFound(e.toString());
    }
    print('Error in getUserView: $e');
    return Response.internalServerError(body: 'Failed to get user view');
  }
}

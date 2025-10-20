import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';

import '../lib/config/db.dart';
import '../lib/routes/event_routes.dart';
import '../lib/routes/view_routes.dart';

void main() async {
  await connectDB();

  final app = Router();

  app.mount('/event', eventRoutes.call);
  app.mount('/view', viewRoutes.call);

  final handler = const Pipeline()
      .addMiddleware(logRequests()) 
      .addMiddleware(corsHeaders(headers: { 
        ACCESS_CONTROL_ALLOW_ORIGIN: '*',
      }))
      .addHandler(app.call); 

  final portStr = '3003';
  final port = int.parse(portStr);
  final server = await io.serve(handler, '0.0.0.0', port);

  print('Server running on port ${server.port}');
}
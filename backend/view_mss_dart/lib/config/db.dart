import 'dart:io';
import 'package:mongo_dart/mongo_dart.dart';

late Db db; 
late DbCollection viewCollection;

Future<void> connectDB() async {
  final uri = "mongodb+srv://baguncadomonstrao:%23CabecaDoVandeco%40321@cluster-smartfarm.xailfpc.mongodb.net/smartfarm?retryWrites=true&w=majority&appName=Cluster-SmartFarm";
  if (uri == null) {
    print('Erro: Variável de ambiente MONGODB_URI não definida.');
    exit(1);
  }

  try {
    db = await Db.create(uri);
    await db.open();
    viewCollection = db.collection('views'); 
    print('Database connected');
  } catch (e) {
    print('Failed to connect to database: $e');
    exit(1);
  }
}
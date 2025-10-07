import 'package:flutter/material.dart';

class LoadingScreen extends StatelessWidget {
  final String text;
  const LoadingScreen({super.key, this.text = 'Carregando dados...'});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F4F6), // gray-100
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 64,
              height: 64,
              child: const CircularProgressIndicator(strokeWidth: 4),
            ),
            const SizedBox(height: 12),
            Text(
              text,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: const Color(0xFF374151), // gray-700
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

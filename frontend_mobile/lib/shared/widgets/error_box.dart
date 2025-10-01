import 'package:flutter/material.dart';

class ErrorBox extends StatelessWidget {
  final String? message;
  const ErrorBox({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    if (message == null || message!.isEmpty) return const SizedBox.shrink();
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFFEE2E2), // red-100
        border: Border.all(color: const Color(0xFFF87171)), // red-400
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        message!,
        style: const TextStyle(
          color: Color(0xFFB91C1C), // red-700
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

Future<bool?> showConfirmationBox(
  BuildContext context, {
  required String message,
  String cancelText = 'Cancelar',
  String confirmText = 'Confirmar',
}) {
  final theme = Theme.of(context);
  return showDialog<bool>(
    context: context,
    barrierDismissible: true,
    builder: (_) {
      return Dialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 24),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                message,
                textAlign: TextAlign.center,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF0B1B52), // azul-950 aprox
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(false),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF0B1B52)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      child: const Text(
                        'Cancelar',
                        style: TextStyle(color: Color(0xFF0B1B52)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDC2626), // red-600 aprox
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      child: const Text('Confirmar'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    },
  );
}

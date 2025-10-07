import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

const Color kAppBackground = Color(0xFFF4F4F4);

const Color kBrandSeed = Color(0xFF16A34A);

class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: kBrandSeed, brightness: Brightness.light),
      scaffoldBackgroundColor: kAppBackground,
    );

    return base.copyWith(
      textTheme: GoogleFonts.quicksandTextTheme(base.textTheme),
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: kAppBackground,
        foregroundColor: base.colorScheme.onSurface,
        centerTitle: false,
        titleTextStyle: GoogleFonts.quicksand(
          textStyle: base.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        isDense: true,
        filled: true,
        fillColor: Colors.white,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        color: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        margin: EdgeInsets.zero,
      ),
    );
  }

  static ThemeData get dark {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: kBrandSeed, brightness: Brightness.dark),
    );

    return base.copyWith(
      textTheme: GoogleFonts.quicksandTextTheme(base.textTheme),
      appBarTheme: const AppBarTheme(elevation: 0),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        isDense: true,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        margin: EdgeInsets.zero,
      ),
    );
  }
}

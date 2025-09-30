class Env {
  static const usersBaseUrl = String.fromEnvironment(
    'USERS_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/users',
  );

  static const sensorsBaseUrl = String.fromEnvironment(
    'SENSORS_BASE_URL',
    defaultValue: 'http://10.0.2.2:3001/sensors',
  );

  static const readingsBaseUrl = String.fromEnvironment(
    'READINGS_BASE_URL',
    defaultValue: 'http://10.0.2.2:3002/readings',
  );

  static const viewBaseUrl = String.fromEnvironment(
    'VIEW_BASE_URL',
    defaultValue: 'http://10.0.2.2:3003/view',
  );
}

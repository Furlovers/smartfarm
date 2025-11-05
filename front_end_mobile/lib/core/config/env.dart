class Env {
  static const usersBaseUrl = String.fromEnvironment(
    'USERS_BASE_URL',
    defaultValue: 'http://10.0.2.2:31000/users',
  );

  static const sensorsBaseUrl = String.fromEnvironment(
    'SENSORS_BASE_URL',
    defaultValue: 'http://10.0.2.2:31001/sensors',
  );

  static const readingsBaseUrl = String.fromEnvironment(
    'READINGS_BASE_URL',
    defaultValue: 'http://10.0.2.2:31002/readings',
  );

  static const viewBaseUrl = String.fromEnvironment(
    'VIEW_BASE_URL',
    defaultValue: 'http://10.0.2.2:31003/view',
  );
}

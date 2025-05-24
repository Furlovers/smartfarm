export const processChartData = (sensors, info) => {
  const dateMap = {};

  sensors.forEach(sensor => {
    sensor.readings.forEach(reading => {
      const dateStr = new Date(reading.data).toISOString().split('T')[0];
      
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: reading.data,
          ...Object.fromEntries(sensors.map(s => [`sensor_${s.id}`, null]))
        };
      }
      
      switch (info) {
        case 'lum':
          dateMap[dateStr][`sensor_${sensor.id}`] = reading.luminosity;
          break;
        case 'ph':
          dateMap[dateStr][`sensor_${sensor.id}`] = reading.ph;
          break;
        case 'temp':
          dateMap[dateStr][`sensor_${sensor.id}`] = reading.temperature;
          break;
        case 'batery':
          dateMap[dateStr][`sensor_${sensor.id}`] = reading.batery;
          break;
        default:
          dateMap[dateStr][`sensor_${sensor.id}`] = reading.luminosity; // Default case
      }
    });
  });

  return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const processListData = (sensors, info) => {
    const processedData = processChartData(sensors, info); // Exemplo para temperatura


const allReadings = processedData.flatMap(dailyData => {
  const date = new Date(dailyData.date);
  
  return Object.entries(dailyData)
    .filter(([key]) => key.startsWith('sensor_'))
    .map(([sensorKey, value]) => ({
      date: date,
      sensorId: sensorKey.replace('sensor_', ''),
      value: value,
    }));
});

    return allReadings
}

export const getAllReadingsAverage = (sensors, info) => {
    const allReadings = processListData(sensors, info);
    
     
  // Verifica se há leituras
  if (!allReadings || allReadings.length === 0) return 0;
  
  // Soma todos os valores
  const sum = allReadings.reduce((total, reading) => total + reading.value, 0);
  
  // Calcula a média
  const average = sum / allReadings.length;
  
  // Retorna com 2 casas decimais
  return average.toFixed(2);

}

export const getDiferenceReadingVsAverage = (sensors, info, value) => {
    const average = getAllReadingsAverage(sensors, info)

    return (((value - average) / average)* 100).toFixed(2)
}
export const processChartData = (sensorList, info) => {
  const dateMap = {};

  sensorList?.forEach(sensor => {
    sensor.readingList?.forEach(reading => {
      const dateStr = new Date(reading.createdAt).toISOString().split('T')[0];

      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: reading.createdAt,
          ...Object.fromEntries(sensorList.map(s => [`sensor_${s._id}`, null])),
        };
      }

      const key = `sensor_${sensor._id}`;
      switch (info) {
        case 'lum':
          dateMap[dateStr][key] = reading.luminosity;
          break;
        case 'ph':
          dateMap[dateStr][key] = reading.pH;
          break;
        case 'temp':
          dateMap[dateStr][key] = reading.temperature;
          break;
        case 'batery':
          dateMap[dateStr][key] = reading.battery;
          break;
        default:
          dateMap[dateStr][key] = reading.luminosity;
      }
    });
  });

  return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
};


export const processListData = (sensorList, info) => {


  const processedData = processChartData(sensorList, info);

  const allReadings = processedData.flatMap(dailyData => {
    const date = new Date(dailyData.date);

    return Object.entries(dailyData)
      .filter(([key]) => key.startsWith('sensor_'))
      .map(([sensorKey, value]) => ({
        date: date,
        sensorId: sensorKey.replace('sensor_', ''),
        value: value,
        sensorName: sensorList.find(sensor => sensor._id === sensorKey.replace('sensor_', ''))?.name || 'Unknown Sensor',
      }));
  });

  return allReadings;
};


export const getAllReadingsAverage = (sensorList, info) => {

  const allReadings = processListData(sensorList, info);

  if (!allReadings || allReadings.length === 0) return 0;

  const sum = allReadings.reduce((total, reading) => total + reading.value, 0);

  return (sum / allReadings.length).toFixed(2);
};

export const getAllReadingsMax = (sensorList, info) => {

  const allReadings = processListData(sensorList, info);

  if (!allReadings || allReadings.length === 0) return 0;

  const max = allReadings.reduce((maxValue, reading) => {
    return reading.value > maxValue ? reading.value : maxValue;
  }, -Infinity);

  return max.toFixed(2);
};


export const getDiferenceReadingVsAverage = (sensorList, info, value) => {

  const average = getAllReadingsAverage(sensorList, info);

  if (average === 0) return '0.00';

  return (((value - average) / average) * 100).toFixed(2);
};
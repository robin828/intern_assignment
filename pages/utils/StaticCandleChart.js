export const staticCandle = (data, interval, len) => {
    if(len===1) {
        const formattedData = data.map(([dateTimeString, ltp, totalVolume]) => ({
            time: Math.floor(new Date(dateTimeString).getTime() / 1000), // Convert timestamp to Date object
            open: ltp,
            high: ltp,
            low: ltp,
            close: ltp,
            volume: totalVolume,
          }));
          
          // Group the data by time intervals and calculate OHLC and volume
          const timeInterval = 60; // 1 minute interval
          const ohlcData = [];
          let currentOHLC = {
            time: formattedData[0].time,
            open: formattedData[0].open,
            high: formattedData[0].high,
            low: formattedData[0].low,
            close: formattedData[0].close,
            volume: formattedData[0].volume,
          };
          
          formattedData.forEach((dataPoint, ind) => {
            const timestamp = dataPoint.time;
            currentOHLC = {
              time: timestamp,
              open: dataPoint.open,
              high: dataPoint.high,
              low: dataPoint.low,
              close: dataPoint.close,
              volume: dataPoint.volume,
            };
            ohlcData.push(currentOHLC);
            
          });
          data = ohlcData
    }
  let j = 0;
  let high = 0;
  let low = data[0]?.low;
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].time - data[j].time >= interval) {
      next = {
        time: data[i].time,
        close: data[i].close,
        open: data[j].open,
        high: high,
        low: low,
      };
      arr.push(next);

      high = data[i].high;
      low = data[i].low;
      j = i;
    } else {
      high = Math.max(high, data[i].high);
      low = Math.min(low, data[i].low);
    }
  }
  console.log(arr)
  return arr;
}

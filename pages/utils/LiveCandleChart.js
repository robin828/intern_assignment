export const liveCandle = (i, j, high, low, chart1) => {
    let next = {};
    const interval = setInterval(() => {
        if(chart1[i].time - chart1[j].time >= 60) {
        next = {
          time: chart1[i].time,
          close: chart1[i].close,
          open: chart1[i].open,
          high: chart1[i].high,
          low: chart1[i].low,
        };
        high = chart1[i].high;
        low = chart1[i].low;
        j=i;
        }
        else {
            high = Math.max(high, chart1[i].high);
            low = Math.min(low, chart1[i].low);
            next = {
                time: chart1[j].time,
                close: chart1[i].close,
                open: chart1[j].open,
                high: high,
                low: low,
              };

        }
        // console.log(next)
        // series1.current.update(next);
        // i = i + 1;
      }, 1000);
      return () => {
        clearInterval(interval);
        return next;
      };
    }

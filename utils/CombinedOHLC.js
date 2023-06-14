
function convertOHLCtoLTP(data) {
  const ltpData = data.map((item) => {
    const ltp = item.close;
    const time = item.time;
    return [ time, ltp ];
  });

  return ltpData;
}
export function combinedThree (arr) {
    let back = arr[0];
    let combined = [];
    for(let i=0;i<arr.length-1;i++) {
        combined = combinedTwo(back, arr[i+1]);
        back = convertOHLCtoLTP(combined);
    }
    return combined;
}
export const combinedTwo = (Data1, Data2) => {
    //console.log(Data1, Data2, "{}{}]]]]");

    const combinedOHLC = [];
    for (let i = 0; i < Math.min(Data1.length, Data2.length); i++) {
      let ltp1 = Data1[i][1];
      let ltp2 = Data2[i][1];

      const open = ltp1;
      const high = Math.max(ltp1, ltp2);
      const low = Math.min(ltp1, ltp2);
      const close = ltp2;
      const time = typeof Data1[i][0] === 'number' ? Data1[i][0] : Math.floor(new Date(Data1[i][0]).getTime() / 1000);

      combinedOHLC.push({ time, open, high, low, close });
    }
    //console.log(combinedOHLC);

    return combinedOHLC;

}


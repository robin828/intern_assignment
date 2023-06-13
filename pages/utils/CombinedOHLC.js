// import { Data1 } from "./Data1";
// import { Data2 } from "./Data2";

function convertOHLCtoLTP(data) {
    // console.log(data, ":::")
  const ltpData = data.map((item) => {
    // console.log(item,"{}|||||))))")
    const ltp = item.close;
    const time = item.time;
    // console.log(time, ":::")
    return [ time, ltp ];
  });

  // console.log(ltpData, "||||");

  return ltpData;
}
export function combinedThree (arr) {
    let back = arr[0];
    // console.log("LLLL{}{}1", back)
    let combined = [];
    // console.log(arr[2], "{}{}12");
    for(let i=0;i<arr.length-1;i++) {
        combined = combinedTwo(back, arr[i+1]);
        // console.log(combined,"PPP")
        back = convertOHLCtoLTP(combined);
        // console.log(back, "{}{}1")
    }
    return combined;
}
export const combinedTwo = (Data1, Data2) => {
    console.log(Data1, Data2, "{}{}]]]]");

    const combinedOHLC = [];
    for (let i = 0; i < Math.min(Data1.length, Data2.length); i++) {
      // console.log(i)
      let ltp1 = Data1[i][1];
      let ltp2 = Data2[i][1];
    //   console.log(ltp1, ltp2, i, "{}{}");

      const open = ltp1;
      const high = Math.max(ltp1, ltp2);
      const low = Math.min(ltp1, ltp2);
      const close = ltp2;
      const time = typeof Data1[i][0] === 'number' ? Data1[i][0] : Math.floor(new Date(Data1[i][0]).getTime() / 1000);
      // console.log(time, "{}{}")

      combinedOHLC.push({ time, open, high, low, close });
    }
    console.log(combinedOHLC);

    return combinedOHLC;

}
const combined = (Data1, Data2, Data3, len) => {
  const combinedOHLC = [];

  if (len === 2) {
    for (let i = 0; i < Math.min(Data1.length, Data2.length); i++) {
      // console.log(i)
      let ltp1 = Data1[i][1];
      let ltp2 = Data2[i][1];
      // console.log(ltp1, ltp2, i);

      const open = ltp1;
      const high = Math.max(ltp1, ltp2);
      const low = Math.min(ltp1, ltp2);
      const close = ltp2;
      const time = Math.floor(new Date(Data1[i][0]).getTime() / 1000);

      combinedOHLC.push({ time, open, high, low, close });
    }
    console.log(combinedOHLC);

    return combinedOHLC;
  } else {
    for (let i = 0; i < Math.min(Data1.length, Data2.length); i++) {
      // console.log(i)
      let ltp1 = Data1[i][1];
      let ltp2 = Data2[i][1];
      let ltp3 = Data3[i][1];
      console.log(ltp1, ltp2, i);

      const open = ltp1;
      const high = Math.max(ltp1, ltp2, ltp3);
      const low = Math.min(ltp1, ltp2, ltp3);
      const close = ltp3;
      const time = Math.floor(new Date(Data1[i][0]).getTime() / 1000);

      combinedOHLC.push({ time, open, high, low, close });
    }
    console.log(combinedOHLC);

    return combinedOHLC;
  }
};

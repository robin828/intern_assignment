import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
export const TwoChartComponent = (props) => {
  const {
    data,
    type,
    seriesObject,
    candleObject,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    let chart;
    let candlestickSeries;
    let series;
    if(type==="candle") {

        chart = createChart(chartContainerRef.current, {
            layout: {
              background: { color: "#222" },
              textColor: "#DDD",
            },
            grid: {
              vertLines: { color: "#444" },
              horzLines: { color: "#444" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
              timeVisible: true,
              secondsVisible: false,
            },
          });

          candlestickSeries = chart.addCandlestickSeries(candleObject);
          candlestickSeries.setData(data);
    }
    if(type==="line") {
        chart = createChart(chartContainerRef.current, {
            layout: {
              background: { type: ColorType.Solid, color: backgroundColor },
              textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
              timeVisible: true,
              secondsVisible: false,
            },
          });
          chart.timeScale().fitContent();
      
        series = chart.addBaselineSeries(seriesObject);
          series.setData(data);
    }
    chart.timeScale().fitContent();

    chart.timeScale().applyOptions({
      borderColor: "#71649C",
    });

    

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div ref={chartContainerRef} />;
};

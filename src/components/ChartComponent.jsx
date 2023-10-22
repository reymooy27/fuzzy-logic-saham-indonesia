import { createChart, ColorType, LineStyle} from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

const ChartComponent = (props) => {
	const {data, isLoading, markerActive, macdCrossover, entryValue, exitValue} = props;

  const [currentCandle,setCurrentCandle] = useState()
	const chartContainerRef = useRef(null);

  const currentLocale = window.navigator.languages[0];
      // Create a number format using Intl.NumberFormat
  const myPriceFormatter = Intl.NumberFormat(currentLocale, {
    style: "currency",
    currency: "IDR", // Currency for data points
  }).format;

	useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef?.current?.clientWidth
      });
    };

    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { color: "#222" },
        textColor: "#C3BCDB",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
      crosshair: {
        mode: 0,
        vertLine: {
            width: 8,
            color: '#C3BCDB44',
            style: LineStyle.Solid,
            labelBackgroundColor: '#9B7DFF',
        },
        horzLine: {
            color: "#9B7DFF",
            labelBackgroundColor: "#9B7DFF",
          },
      },
      localization: {
        // locale: 
        priceFormatter: myPriceFormatter
      },
      timeScale:{
        borderColor: "#71649C",
        barSpacing: 10
      },
      rightPriceScale:{
        borderColor: "#71649C"
      },
      autoSize: true,
    });

    const lineData = data.map(datapoint => ({
        time: datapoint.time,
        value: (datapoint.close + datapoint.open) / 2,
    }));

    const areaSeries = chart.addAreaSeries({
        lastValueVisible: false, // hide the last value marker for this series
        crosshairMarkerVisible: false, // hide the crosshair marker for this series
        lineColor: 'transparent', // hide the line
        topColor: 'rgba(56, 33, 110,0.6)',
        bottomColor: 'rgba(56, 33, 110, 0.1)',
    });
    areaSeries.setData(lineData)

    const newSeries = chart.addCandlestickSeries();
    newSeries.setData(data);

    newSeries.priceScale().applyOptions({
      autoScale: false, // disables auto scaling based on visible content
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
    });
    
    const subscribeCrosshair = (param)=>{
      if(param.time){
        const map = param.seriesData;
        const value = map.get(newSeries)
        setCurrentCandle(value)
      }
    }

    chart.subscribeCrosshairMove(subscribeCrosshair)

    const markers = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].entry > entryValue && data[i].entry !== data[i].exit) {
        markers.push({
          time: data[i].time,
          position: 'belowBar',
          color: '#2196F3',
          shape: 'arrowUp',
          text: markerActive && 'Beli @ ' + (data[i].close),
          size: markerActive ? 1 : 0
        });
      } else if(data[i].exit > exitValue && data[i].entry !== data[i].exit) {
        markers.push({
          time: data[i].time,
          position: 'aboveBar',
          color: '#e91e63',
          shape: 'arrowDown',
          text: markerActive && 'Sell @ ' + data[i].close,
          size: markerActive ? 1 : 0
        });
      } else if(data[i].macd_deathcross){
        markers.push({
          time: data[i].time,
          position: 'aboveBar',
          color: '#000',
          shape: 'circle',
          text: macdCrossover && 'DeathCross',
          size: macdCrossover ? 1 : 0
        });

      } else if(data[i].macd_goldencross){
        markers.push({
          time: data[i].time,
          position: 'aboveBar',
          color: '#f68410',
          shape: 'circle',
          text: macdCrossover && 'GoldenCross',
          size: macdCrossover ? 1 : 0
        });

      }
    }

    newSeries.setMarkers(markers);

    window.addEventListener('resize', handleResize);

    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.unsubscribeCrosshairMove(subscribeCrosshair)
      chart.remove();
    };
  },[data, isLoading]);

	return (
    <>
      <div className='w-full h-full'
        ref={chartContainerRef}
      >
        <div 
          className='
          absolute 
          top-[10px] 
          left-[10px] 
          z-10 
          bg-slate-400 
          rounded-md 
          p-4 border 
          border-black 
          shadow-lg'
        >
          <h1>{data[0]?.name} (<b>{data[0]?.code}</b>)</h1>        
          <h1>{data[0]?.sector}</h1>        
          <p>Open : {currentCandle?.open}</p>
          <p>Close : {currentCandle?.close}</p>
          <p>High : {currentCandle?.high}</p>
          <p>Low : {currentCandle?.low}</p>
          <p>{currentCandle?.time}</p>
        </div>
      </div>
    </>
	);
};

export default ChartComponent
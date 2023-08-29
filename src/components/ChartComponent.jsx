import { createChart, ColorType} from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

const ChartComponent = (props) => {
	const {data} = props;

  const [currentCandle,setCurrentCandle] = useState()
	const chartContainerRef = useRef(null);

	useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef?.current?.clientWidth
      });
    };

    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { type: ColorType.Solid, },
      },
      crosshair: {
        mode: 1
      },
      localization: {
        // locale: 
      },
      autoSize: true,
    });

    const newSeries = chart.addCandlestickSeries();
    newSeries.setData(data);

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
      if (data[i].entry > 60) {
        markers.push({
          time: data[i].time,
          position: 'belowBar',
          color: '#2196F3',
          shape: 'arrowUp',
          text: 'Beli @ ' + (data[i].close),
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
  },[data,]);

	return (
		<div className='w-full h-full'
			ref={chartContainerRef}
		>
      <div className='absolute top-[10px] left-[10px] z-10 bg-slate-400 rounded-md p-4'>
        <h1>{data[0]?.code}</h1>        
        <p>Open : {currentCandle?.open}</p>
        <p>Close : {currentCandle?.close}</p>
        <p>High : {currentCandle?.high}</p>
        <p>Low : {currentCandle?.low}</p>
        <p>{currentCandle?.time}</p>
      </div>
    </div>
	);
};

export default ChartComponent
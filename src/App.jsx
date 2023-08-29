
import React, { Suspense, useEffect, useRef, useState } from 'react';
import ChartComponent from './components/ChartComponent';


const Home = ()=>{

  const [kodeSaham, setKodeSaham] = useState('BBCA');
  const [data, setData] = useState([]);
    
useEffect(() => {
  
  const getData = async ()=>{
    const res = await fetch(`http://127.0.0.1:8000/api/saham?kode=${kodeSaham}`, {cache: 'force-cache'})
    const data = await res.json()
    setData(data)
  }

  getData()
}, [kodeSaham]);


  const handleChange = (e)=>{
    setKodeSaham(e.target.value)
  }


  const extractedData = data.map((item)=> ({
  code: item.code,
  time: item.Date,
  open: item.Open,
  close: item.Close,
  high: item.High,
  low: item.Low,
  volume: item.Volume,
  entry: item.Entry_Position,
  rsi: item.RSI,
  macd_crossover: item.MACD_Crossover,
  engulfing: item.Engulfing,

}));

	return (
    <div className='relative w-screen h-screen'>
      <select onChange={handleChange} className='absolute top-[10px] right-[50px] z-10 text-black border border-black p-3'name="" id="">
        <option value="BBCA">BBCA</option>
        <option value="BBRI">BBRI</option>
        <option value="BMRI">BMRI</option>
        <option value="ASII">ASII</option>
      </select>
      <Suspense fallback={<div>Loading...</div>}>
        <ChartComponent data={extractedData}></ChartComponent>
      </Suspense>
    </div>
	);
}

export default Home
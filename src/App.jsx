
import React, { Suspense, useEffect, useRef, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import { useNavigate, useParams } from 'react-router-dom';


const Home = ()=>{

  const {code} = useParams()
  const navigate = useNavigate()

  const [kodeSaham, setKodeSaham] = useState(code);
  const [data, setData] = useState([]);
  const [namaSaham, setNamaSaham] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  
    
useEffect(() => {

  setIsLoading(true)
  
  const getData = async ()=>{
    const res = await fetch(`http://127.0.0.1:8000/api/saham?kode=${kodeSaham}`)
    const data = await res.json()
    setData(data)
    setIsLoading(false)
  }

  getData()
}, [kodeSaham]);

useEffect(() => {
  const getDataNamaSaham = async ()=>{
    const res = await fetch(`http://127.0.0.1:8000/api/saham/all`)
    const data = await res.json()
    setNamaSaham(data)
  }
  getDataNamaSaham()
}, []);

  const handleChange = (e)=>{
    setKodeSaham(e.target.value)
    navigate('/stock/' + e.target.value)
  }

const selectedStock = namaSaham.filter(a=> a.code === kodeSaham.toUpperCase())[0]

  const extractedData = data.map((item)=> ({
    name: selectedStock.name,
    sector: selectedStock.sector,
    code: selectedStock.code,
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
      <select onChange={handleChange} className='absolute top-[10px] right-[80px] z-10 text-black border border-black p-3 rounded'name="" id="">
        {namaSaham.map(saham=>(
          <option key={saham.id} selected={saham.code === code} value={saham.code == code ? code : saham.code}>{saham.code.toUpperCase()}</option>
        ))}
      </select>
      <Suspense fallback={<div>Loading...</div>}>
        <ChartComponent data={extractedData} isLoading={isLoading}></ChartComponent>
      </Suspense>
    </div>
	);
}

export default Home
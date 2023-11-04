
import React, { Suspense, useEffect, useRef, useState } from 'react';
import ChartComponent from './components/ChartComponent';
import { useNavigate, useParams } from 'react-router-dom';


const Home = ()=>{

  const {code} = useParams()
  const navigate = useNavigate()

  const [kodeSaham, setKodeSaham] = useState(code);
  const [data, setData] = useState([]);
  const [namaSaham, setNamaSaham] = useState([]);
  const [markerActive, setMarkerActive] = useState(true);
  const [macdCrossover, setMacdCrossover] = useState(false);
  const [entryValue, setEntryValue] = useState(50);
  const [exitValue, setExitValue] = useState(50);

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
    exit: item.Exit_Position,
    rsi: item.RSI,
    macd_goldencross: item.MACD_GoldenCross,
    macd_deathcross: item.MACD_DeathCross,
    engulfing: item.Engulfing,
    bullish_hammer: item.BullishHammer,

}));

const macdCheck = ()=>{
  setMacdCrossover(!macdCrossover)
  setMarkerActive(!markerActive)
}
// console.log(data)
const insigth = (data)=>{
  let res = ''
  const today = data[data?.length-1]
  if(today?.Entry_Position > 30 & today?.Exit_Position < today?.Entry_Position){
    res = `Saham cenderung mengalami kenaikan untuk beberapa hari kedepan. Bisa beli direntang harga ${today.RollingMin} - ${today.Close + (today.Close * 0.01)}`
  }else if(today?.Entry_Position > 50 & today?.Exit_Position < today?.Entry_Position){
    res = `Saham akan mengalami kenaikan untuk beberapa hari kedepan. Bisa beli direntang harga ${today.RollingMin} - ${today.Close + (today.Close * 0.01)}`
  }
  else if(today?.Entry_Position < 30 & today?.Exit_Position <= today?.Entry_Position){
    res = 'Hold position'
  }else if(today?.Exit_Position > 30 & today?.Entry_Position < today?.Exit_Position){
    res = `Saham cenderung mengalami penurunan untuk beberapa hari kedepan. Bisa jual direntang harga ${today.Close} - ${today.RollingMax}`
  }else if(today?.Exit_Position > 50 & today?.Entry_Position < today?.Exit_Position){
    res = `Saham akan mengalami penurunan untuk beberapa hari kedepan. Bisa jual direntang harga ${today.Close} - ${today.RollingMax}`
  }else{
    res ='Hold Position'
  }



  return res

}

	return (
    <div className='relative w-screen h-screen'>
      <div className='absolute top-[10px] right-[80px] z-10 flex flex-col gap-2'>
        <select onChange={handleChange} className='text-black border border-black p-3 rounded bg-slate-400'name="" id="">
          {namaSaham.map(saham=>(
            <option key={saham.id} selected={saham.code === code} value={saham.code == code ? code : saham.code}>{saham.code.toUpperCase()}</option>
          ))}
        </select>
        <div className='flex gap-2 border border-black rounded bg-slate-400 p-3'>
          <span>Marker</span>
          <input type="checkbox" name="" id="" onChange={()=> setMarkerActive(!markerActive)} checked={markerActive}/>
        </div>
        {/* <div className='flex gap-2 border border-black rounded bg-slate-400 p-3'>
          <span>MACD Crossover</span>
          <input type="checkbox" name="" id="" onChange={macdCheck} checked={macdCrossover}/>
        </div>
        <div className='flex gap-2 border border-black rounded bg-slate-400 p-3'>
          <span>Entry Value</span>
          <input type="text" name="" id="" value={entryValue} onChange={e=> setEntryValue(e.target.value)}/>
        </div>
        <div className='flex gap-2 border border-black rounded bg-slate-400 p-3'>
          <span>Exit Value</span>
          <input type="text" name="" id="" value={exitValue} onChange={e=> setExitValue(e.target.value)}/>
        </div> */}
      </div>
      <div className='bg-slate-400 rounded absolute bottom-[10px] right-[80px] z-10 flex flex-col gap-2 w-[300px] h-[150px] p-3'>
        {insigth(data)}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ChartComponent 
        data={extractedData} 
        isLoading={isLoading} 
        markerActive={markerActive} 
        macdCrossover={macdCrossover} 
        exitValue={exitValue} 
        entryValue={entryValue}></ChartComponent>
      </Suspense>
    </div>
	);
}

export default Home
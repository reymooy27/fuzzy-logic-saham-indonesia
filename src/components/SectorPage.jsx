import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SectorPage() {

  const [dataSaham, setDataSaham] = useState([]);
  

  useEffect(() => {
    const getDataSaham = async ()=>{
      const res = await fetch(`http://127.0.0.1:8000/api/saham/all`)
      const data = await res.json()
      setDataSaham(data)
    }
    getDataSaham()
  }, []);

  const filteredData = (filter)=>{
    return dataSaham.filter(saham=> saham.sector === filter)
  }

  return (
    <div className="p-3">
    <div className="font-bold text-white">Jumlah Saham : {dataSaham.length}</div>
      <div className="w-full h-full flex gap-3">
        <SectorCard sector={'Healthcare'} data={dataSaham}/>
        <SectorCard sector={'Financials'} data={dataSaham}/>
        <SectorCard sector={'Basic Materials'} data={dataSaham}/>
        <SectorCard sector={'Consumer Cyclicals'} data={dataSaham}/>
        <SectorCard sector={'Consumer Non-Cyclicals'} data={dataSaham}/>
      </div>

      <div className="w-full h-full flex gap-3">
        <SectorCard sector={'Energy'} data={dataSaham}/>
        <SectorCard sector={'Industrials'} data={dataSaham}/>
        <SectorCard sector={'Transportation & Logistic'} data={dataSaham}/>
        <SectorCard sector={'Technology'} data={dataSaham}/>
        <SectorCard sector={'Infrastructures'} data={dataSaham}/>
      </div>
        
      <div className="w-full h-full flex gap-3">
        <SectorCard sector={'Properties & Real Estate'} data={dataSaham}/>
      </div>
    </div>
  )
}


const SectorCard = ({data, sector})=>{

  const filteredData = (filter)=>{
    return data.filter(saham=> saham.sector === filter)
  }

  return(
    <div className="w-[200px] h-fit rounded border border-black p-4 bg-slate-400 flex flex-col gap-1">
      <h1 className="font-bold text-black">{sector}</h1>
      {filteredData(sector).map(saham=>(
        <Link key={saham.id} className="underline w-fit text-black" to={`/stock/${saham.code}`}>{saham.code}</Link>
      ))}
    </div>
)
}
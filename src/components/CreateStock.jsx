import React, { useState } from "react";

export default function CreateStock() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [csv, setCsv] = useState(null);

  const [responses, setResponses] = useState('');
  

  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('name',name)
    formData.append('code',code)
    formData.append('sector',sector)
    formData.append('csv_file',csv)
    
    await fetch('http://127.0.0.1:8000/api/create', {
      method: 'POST',
      body: formData,
    })
    .then(res=>{
      if(res.ok){
        setIsLoading(false)
        setResponses(res.statusText)
        setName('');
        setCode('');
        setSector('');
        setCsv('');
      }
    })
    .catch(err=>{
      setIsLoading(false)
      setResponses(err.message)
      console.log('Err ' + err)
    })
  }
  
  return (
  <div className="w-full h-full mb-5">
    <form action="" className="flex flex-col w-[300px] border border-black p-4" onSubmit={handleSubmit}>
      <div className="flex mb-3">
        <label htmlFor="name">Nama Saham</label>
        <input className='border border-black'type="text" name="name" required value={name} onChange={(e)=> setName(e.target.value)}/>
      </div>
      <div className="flex mb-3">
        <label htmlFor="code">Kode Saham</label>
        <input className='border border-black'type="text" name="code" required value={code} onChange={(e)=> setCode(e.target.value)}/>
      </div>
      <div className="flex mb-3">
        <label htmlFor="sector">Sektor Saham</label>
        <input className='border border-black'type="text" name="sector" required value={sector} onChange={(e)=> setSector(e.target.value)}/>
      </div>
      <input className="mb-3" type="file" name="csv_file" id="" accept=".csv" onChange={(e)=> setCsv(e.target.files[0])}/>
      <button type="submit" className="border border-black rounded-md" disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>
      {responses !== '' ? <span>{responses}</span> : ''}
    </form>    
  </div>
    );
}

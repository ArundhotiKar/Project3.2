import React, { useEffect, useState } from 'react';

export default function EquipmentPage(){
  const [items, setItems] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:5000/equipment')
      .then(r=>r.json())
      .then(setItems)
      .catch(err=>console.error(err));
  },[]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Equipment</h2>
      <div className="bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {items.map(it=> (
            <li key={it._id} className="flex justify-between">
              <div>{it.name} <span className="text-sm text-gray-500">{it.category}</span></div>
              <div className="text-sm">{it.available}/{it.total}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

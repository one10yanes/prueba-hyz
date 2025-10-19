
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function GraficoEstado({ data = {} }){
  if(!data || Object.keys(data).length === 0){
    return <div style={{padding:20,color:'var(--muted)',textAlign:'center'}}>No hay datos para graficar.</div>;
  }

  const labels = Object.keys(data);
  const values = Object.values(data).map(v => Number(v) || 0);
  const palette = ['#258ad6','#43a047','#9e9e9e','#ff9800','#8e24aa'];

  const chartData = {
    labels,
    datasets:[{ label:'Proyectos', data:values, backgroundColor: labels.map((_,i)=>palette[i%palette.length]) }]
  };

  const options = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1 } } }
  };

  return (
    <div style={{width:'100%', height:280, minHeight:240}}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default GraficoEstado;
import React from 'react';
import './tabla.css';

function formatFecha(fecha){
  if(!fecha) return '';
  const d = new Date(fecha);
  if(isNaN(d)) return fecha;
  return d.toLocaleDateString('es-PE');
}

function ProyectoTabla({ proyectos = [], onEdit = () => {}, onDelete = () => {} }){
  const getEstadoIcon = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'finalizado': return '✅';
      case 'en progreso': return '⏳';
      case 'pendiente': return '⏸️';
      default: return '📋';
    }
  };

  return (
    <div className="tabla-container">
      <table className="proyectos-table" role="table" aria-label="Lista de proyectos">
        <thead>
          <tr>
            <th style={{width:50}}>ID</th>
            <th style={{width:140}}>Nombre</th>
            <th>Descripción</th>
            <th style={{width:130}}>Estado</th>
            <th style={{width:100}}>Fecha Inicio</th>
            <th style={{width:100}}>Fecha Fin</th>
            <th style={{width:180}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map(p => (
            <tr key={p.id}>
              <td data-label="ID">{p.id}</td>
              <td data-label="Nombre">{p.nombre}</td>
              <td className="descripcion" data-label="Descripción" title={p.descripcion}>{p.descripcion}</td>
              <td className="estadoCell" data-label="Estado">
                <span className={`estado ${String(p.estado || '').toLowerCase().replace(/\s+/g,'-')}`}>
                  {getEstadoIcon(p.estado)} {p.estado}
                </span>
              </td>
              <td data-label="Inicio">{formatFecha(p.fechaInicio)}</td>
              <td data-label="Fin">{formatFecha(p.fechaFin)}</td>
              <td data-label="Acciones" className="acciones">
                <button className="btn btn-ghost" onClick={()=>onEdit(p)}>Editar</button>
                <button className="btn btn-danger" onClick={()=>onDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {proyectos.length === 0 && (
            <tr><td colSpan="7" style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>
              📭 No hay proyectos registrados
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProyectoTabla;

import React, { useState, useEffect } from 'react';

function FormularioProyecto({ onAdd = ()=>{}, editProyecto = null, onSaveEdit = ()=>{} }){
  const [form, setForm] = useState({ nombre:'', descripcion:'', estado:'En progreso', fechaInicio:'', fechaFin:'' });

  useEffect(()=>{
    if(editProyecto){
      setForm({
        id: editProyecto.id,
        nombre: editProyecto.nombre || '',
        descripcion: editProyecto.descripcion || '',
        estado: editProyecto.estado || 'En progreso',
        fechaInicio: editProyecto.fechaInicio?.slice(0,10) || '',
        fechaFin: editProyecto.fechaFin?.slice(0,10) || ''
      });
    } else {
      setForm({ nombre:'', descripcion:'', estado:'En progreso', fechaInicio:'', fechaFin:'' });
    }
  },[editProyecto]);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.nombre || !form.descripcion || !form.fechaInicio){
      alert('Completa los campos obligatorios: Nombre, Descripción y Fecha Inicio');
      return;
    }
    if(editProyecto){
      await onSaveEdit(form);
    } else {
      const res = await fetch('http://localhost:3000/proyectos', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
      });
      if(res.ok){ setForm({ nombre:'', descripcion:'', estado:'En progreso', fechaInicio:'', fechaFin:'' }); onAdd(); }
    }
  };

  return (
    <form className="form-proyecto card" onSubmit={handleSubmit} aria-label="Formulario proyecto">
      <h2>{editProyecto ? 'Editar Proyecto' : 'Registrar Proyecto'}</h2>
      <input name="nombre" placeholder="Nombre *" value={form.nombre} onChange={handleChange} />
      <textarea name="descripcion" placeholder="Descripción *" value={form.descripcion} onChange={handleChange} />
      <select name="estado" value={form.estado} onChange={handleChange}>
        <option>En progreso</option>
        <option>Finalizado</option>
        <option>Pendiente</option>
      </select>
      <label style={{fontSize:12,color:'#555'}}>Fecha Inicio *</label>
      <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />
      <label style={{fontSize:12,color:'#555'}}>Fecha Fin</label>
      <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{editProyecto ? 'Guardar' : 'Agregar'}</button>
        {editProyecto ? (
          <button type="button" className="btn btn-ghost" onClick={()=>onSaveEdit(null)}>Cancelar</button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={()=>setForm({nombre:'',descripcion:'',estado:'En progreso',fechaInicio:'',fechaFin:''})}>Limpiar</button>
        )}
      </div>
    </form>
  );
}

export default FormularioProyecto;
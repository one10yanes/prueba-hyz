import { useEffect, useState } from 'react';
import ProyectoTabla from './components/tabla';
import ModalProyecto from './components/ModalProyecto';
import './App.css';
import GraficoEstado from './components/GraficoEstado';

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [editProyecto, setEditProyecto] = useState(null);
  const [graficos, setGraficos] = useState(null);
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarProyectos = () => {
    setLoading(true);
    fetch('http://localhost:3000/proyectos')
      .then(res => res.json())
      .then(data => setProyectos(data))
      .catch(err => console.error(err))
      .finally(()=>setLoading(false));
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  // Eliminar proyecto
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/proyectos/${id}`, { method: 'DELETE' });
    cargarProyectos();
  };

  // Editar proyecto (abre el modal con datos)
  const handleEdit = (proyecto) => {
    setEditProyecto(proyecto);
    setIsModalOpen(true);
  };
  
  // Guardar edición
  const handleSaveEdit = async (form) => {
    await fetch(`http://localhost:3000/proyectos/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setEditProyecto(null);
    cargarProyectos();
  };

  // Abrir modal para crear proyecto
  const handleNuevoProyecto = () => {
    setEditProyecto(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditProyecto(null);
  };

  // Mostrar datos de /graficos
  const handleGraficos = async () => {
    const res = await fetch('http://localhost:3000/graficos');
    const data = await res.json();
    setGraficos(data);
  };

  // Mostrar resumen IA de /analisis
  const handleAnalisis = async () => {
    setLoadingAnalisis(true);
    try {
      const res = await fetch('http://localhost:3000/analisis');
      const data = await res.json();
      setAnalisis(data.resumen);
    } catch (error) {
      console.error('Error al obtener análisis:', error);
      setAnalisis(null);
    } finally {
      setLoadingAnalisis(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content">
        <div className="content-header">
          <h1>📋 Gestión de Proyectos</h1>
          <div className="header-controls">
            <input 
              className="search-input"
              placeholder="Buscar proyectos..." 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
            />
            <button className="btn btn-primary" onClick={handleNuevoProyecto}>
              ➕ Nuevo Proyecto
            </button>
            {loading && <span style={{fontSize:14,color:'var(--muted)'}}>⏳</span>}
          </div>
        </div>

        <div className="content-body">
          <div className="grid-area">
            <div className="table-area">
              <ProyectoTabla
                proyectos={proyectos.filter(p => (p.nombre||'').toLowerCase().includes(query.toLowerCase()) || (p.descripcion||'').toLowerCase().includes(query.toLowerCase()))}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <div className="side-area">
              <div className="actions-row">
                <button className="btn btn-primary" onClick={handleGraficos}>📊 Ver Gráficos</button>
                <button className="btn btn-success" onClick={handleAnalisis}>🤖 Resumen IA</button>
              </div>

              {graficos && (
                <div className="side-panel">
                  <h3>📈 Proyectos por Estado</h3>
                  <GraficoEstado data={graficos} />
                </div>
              )}

              {loadingAnalisis && (
                <div className="side-panel">
                  <h3>🤖 Análisis con IA</h3>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',color:'var(--muted)'}}>
                    <div className="spinner"></div>
                    <p style={{marginTop:16,fontSize:14}}>Generando análisis con IA...</p>
                  </div>
                </div>
              )}

              {analisis && !loadingAnalisis && (
                <div className="side-panel">
                  <h3>🤖 Análisis con IA</h3>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {analisis.split('*').filter(Boolean).map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.7rem', lineHeight: '1.5' }}>
                        {item.replace(/^[^a-zA-Z0-9]+/, '').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalProyecto
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={cargarProyectos}
        editProyecto={editProyecto}
        onSaveEdit={handleSaveEdit}
      />
    </div>
  );
}

export default App;
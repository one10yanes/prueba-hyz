const Proyecto = require('../models/Proyecto');

// Listar todos los proyectos
exports.getAll = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
};

// Obtener un proyecto por ID
exports.getById = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByPk(req.params.id);
        if (!proyecto) return res.status(404).json({ error: 'No encontrado' });
        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proyecto' });
    }
};

// Crear un nuevo proyecto
exports.create = async (req, res) => {
    try {
        const nuevo = await Proyecto.create(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear proyecto' });
    }
};

// Actualizar un proyecto
exports.update = async (req, res) => {
    try {
        const actualizado = await Proyecto.update(req.body, {
            where: { id: req.params.id }
        });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar proyecto' });
    }
};

// Eliminar un proyecto
exports.delete = async (req, res) => {
    try {
        await Proyecto.destroy({ where: { id: req.params.id } });
        res.json({ mensaje: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proyecto' });
    }
};
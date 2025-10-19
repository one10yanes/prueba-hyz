const express = require('express');
const controlador = require('../controllers/proyectoControlador');

const router = express.Router();

/**
 * @swagger
 * /proyectos:
 *   get:
 *     summary: Lista todos los proyectos
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/proyectos', (req, res) => {
    controlador.getAll(req, res);
});

/**
 * @swagger
 * /proyectos/{id}:
 *   get:
 *     summary: Obtiene un proyecto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/proyectos/:id', (req, res) => {
    controlador.getById(req, res);
});

/**
 * @swagger
 * /proyectos:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       500:
 *         description: Error al crear proyecto
 */
router.post('/proyectos', (req, res) => {
    controlador.create(req, res);
});

/**
 * @swagger
 * /proyectos/{id}:
 *   put:
 *     summary: Actualiza un proyecto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al actualizar proyecto
 */
router.put('/proyectos/:id', (req, res) => {
    controlador.update(req, res);
});

/**
 * @swagger
 * /proyectos/{id}:
 *   delete:
 *     summary: Elimina un proyecto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al eliminar proyecto
 */
router.delete('/proyectos/:id', (req, res) => {
    controlador.delete(req, res);
});

const { GoogleGenAI } = require("@google/genai");

/**
 * @swagger
 * /analisis:
 *   get:
 *     summary: Genera un resumen de las descripciones de los proyectos usando Gemini
 *     responses:
 *       200:
 *         description: Resumen generado por IA
 *       500:
 *         description: Error al generar el resumen
 */
router.get('/analisis', async (req, res) => {
    const Proyecto = require('../models/Proyecto');
    try {
        const proyectos = await Proyecto.findAll({ attributes: ['descripcion'] });
        const descripciones = proyectos.map(p => p.descripcion).join('\n');
        const ai = new GoogleGenAI({}); 
        const prompt = `Describe en una línea el propósito o resultado principal de cada proyecto:\n${descripciones}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        res.json({ resumen: response.text });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el resumen', detalle: error.message });
    }
});


/**
 * @swagger
 * /graficos:
 *   get:
 *     summary: Devuelve la cantidad de proyectos por estado
 *     responses:
 *       200:
 *         description: Datos agregados por estado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: integer
 */
router.get('/graficos', async (req, res) => {
    const Proyecto = require('../models/Proyecto');
    try {
        const proyectos = await Proyecto.findAll({ attributes: ['estado'] });
        const conteo = {};

        proyectos.forEach(p => {
            conteo[p.estado] = (conteo[p.estado] || 0) + 1;
        });

        res.json(conteo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos para gráficos', detalle: error.message });
    }
});



module.exports = router;
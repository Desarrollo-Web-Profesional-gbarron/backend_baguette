import { crearComentario } from '../servicios/comentariosServicio.js';

export function comentariosRoutes(app) {
    // Middleware para limpiar scripts maliciosos en el body
    app.post(
        '/api/v1/comentarios',
        [
            // 1. Capa de Validación y Sanitización
            body('texto')
                .trim()
                .notEmpty().withMessage('El texto es requerido')
                .isLength({ max: 500 }).withMessage('El comentario es demasiado largo')
                .escape(), // Convierte <script> en &lt;script&gt;
            
            body('puntuacion')
                .isInt({ min: 1, max: 5 }).withMessage('La puntuación debe ser un número entre 1 y 5')
        ],
        async (req, res) => {
            // 2. Verificación de errores de validación
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ errores: errores.array() });
            }

            try {
                const { texto, puntuacion } = req.body;
                
                // 3. Lógica de negocio
                const nuevoComentario = await crearComentario(texto, puntuacion);
                
                return res.status(201).json({
                    status: 'success',
                    data: nuevoComentario
                });

            } catch (err) {
                // 4. Manejo de errores seguro
                console.error('ID de error de seguridad:', Date.now(), err); 
                return res.status(500).json({
                    error: 'Error interno del servidor',
                    mensaje: 'No se pudo procesar el comentario en este momento'
                });
            }
        }
    );
}
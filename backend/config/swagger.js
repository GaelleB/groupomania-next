module.exports = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Groupomania API',
            version: '1.0.0',
            description: 'API REST pour l\'application Groupomania - Réseau social d\'entreprise',
            contact: {
                name: 'Support API',
                email: 'support@groupomania.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Serveur de développement'
            },
            {
                url: 'https://your-production-url.com/api',
                description: 'Serveur de production'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenu après connexion'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        nom: { type: 'string', example: 'Dupont' },
                        prenom: { type: 'string', example: 'Jean' },
                        email: { type: 'string', format: 'email', example: 'jean.dupont@groupomania.com' },
                        role: { type: 'string', example: 'user' },
                        image: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Post: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Mon premier post' },
                        content: { type: 'string', example: 'Contenu du post...' },
                        image: { type: 'string', nullable: true },
                        userId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        content: { type: 'string', example: 'Super post !' },
                        userId: { type: 'integer', example: 1 },
                        postId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

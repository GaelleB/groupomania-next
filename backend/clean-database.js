const { sequelize } = require('./models');
require('dotenv').config();

async function cleanDatabase() {
    try {
        console.log('🔌 Connexion à la base de données...');
        await sequelize.authenticate();
        console.log('✅ Connecté !');

        console.log('\n🗑️  Suppression des données...');

        // Supprimer dans l'ordre pour respecter les contraintes
        await sequelize.query('DELETE FROM Comments');
        console.log('✓ Commentaires supprimés');

        await sequelize.query('DELETE FROM Likes');
        console.log('✓ Likes supprimés');

        await sequelize.query('DELETE FROM Dislikes');
        console.log('✓ Dislikes supprimés');

        await sequelize.query('DELETE FROM Posts');
        console.log('✓ Posts supprimés');

        await sequelize.query('DELETE FROM Users');
        console.log('✓ Utilisateurs supprimés');

        console.log('\n🔄 Réinitialisation des compteurs...');
        await sequelize.query('ALTER TABLE Users AUTO_INCREMENT = 1');
        await sequelize.query('ALTER TABLE Posts AUTO_INCREMENT = 1');
        await sequelize.query('ALTER TABLE Comments AUTO_INCREMENT = 1');
        await sequelize.query('ALTER TABLE Likes AUTO_INCREMENT = 1');
        await sequelize.query('ALTER TABLE Dislikes AUTO_INCREMENT = 1');
        console.log('✓ Compteurs réinitialisés');

        console.log('\n✨ Base de données nettoyée avec succès !');
        console.log('Vous pouvez maintenant créer de nouveaux comptes.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

cleanDatabase();

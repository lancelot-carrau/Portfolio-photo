// updatePhotos.js - Script pour mettre à jour le fichier photos.js

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// Récupérer le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  baseUrl: 'https://raw.githubusercontent.com/the-gadget-lab/Photos-Selec/refs/heads/photo/photos',
  outputPath: path.join(__dirname, 'src/photos/photos.js'),
  categories: [
    { 
      name: 'japon', 
      folder: 'japon', 
      prefix: 'japon', 
      extensions: ['jpg', 'JPEG'] 
    },
    { 
      name: 'france', 
      folder: 'france', 
      prefix: 'france', 
      extensions: ['jpg', 'JPEG'] 
    },
    { 
      name: 'polynesie', 
      folder: 'polynesie', 
      prefix: 'polynesie', 
      extensions: ['jpg', 'JPEG'] 
    },
    { 
      name: 'italie', 
      folder: 'div', 
      prefix: 'italie', 
      extensions: ['jpg', 'JPEG'] 
    },
    { 
      name: 'espagne', 
      folder: 'div', 
      prefix: 'espagne', 
      extensions: ['jpg', 'JPEG'] 
    }
  ]
};

// Vérifier si une URL est accessible
function checkUrlExists(url) {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Générer le code JS pour le tableau de photos
function generatePhotoArrayCode(photos) {
  const photosJson = JSON.stringify(photos, null, 2);
  return `// Ce fichier est généré automatiquement par updatePhotos.js
// Dernière mise à jour: ${new Date().toLocaleString()}

export const photos = ${photosJson};

export default photos;
`;
}

// Fonction principale pour scanner et mettre à jour photos.js
async function updatePhotoDatabase() {
  console.log('🔍 Recherche de photos sur GitHub...');
  const allPhotos = [];
  
  for (const category of config.categories) {
    console.log(`\n📁 Catégorie: ${category.name}`);
    
    let index = 1;
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;
    
    while (consecutiveErrors < MAX_CONSECUTIVE_ERRORS) {
      const formattedIndex = String(index).padStart(2, '0');
      let found = false;
      
      for (const ext of category.extensions) {
        const fileName = `${category.prefix}-${formattedIndex}.${ext}`;
        const url = `${config.baseUrl}/${category.folder}/${fileName}`;
        
        try {
          const exists = await checkUrlExists(url);
          
          if (exists) {
            const photo = {
              id: `${category.name}-${formattedIndex}`,
              category: category.name,
              src: url
            };
            
            console.log(`  ✅ Trouvé: ${fileName}`);
            allPhotos.push(photo);
            found = true;
            consecutiveErrors = 0;
            break;
          }
        } catch (error) {
          console.error(`  ❌ Erreur: ${error.message}`);
        }
      }
      
      if (!found) {
        consecutiveErrors++;
        console.log(`  ❌ Non trouvé: ${category.prefix}-${formattedIndex}.*`);
      }
      
      index++;
    }
  }
  
  // Générer et enregistrer le fichier photos.js
  try {
    const fileContent = generatePhotoArrayCode(allPhotos);
    
    // Créer le dossier si nécessaire
    const dir = path.dirname(config.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(config.outputPath, fileContent);
    console.log(`\n✨ ${allPhotos.length} photos exportées dans ${config.outputPath}`);
  } catch (error) {
    console.error(`\n❌ Erreur lors de l'enregistrement du fichier:`, error);
  }
}

// Exécuter la mise à jour
updatePhotoDatabase().then(() => {
  console.log('\n🎉 Mise à jour terminée!');
}).catch((error) => {
  console.error('\n💥 Erreur:', error);
});
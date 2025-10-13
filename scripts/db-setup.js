#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📋 Database Setup Instructions');
console.log('=============================\n');

console.log('1. Öffnen Sie Ihr Supabase Projekt Dashboard');
console.log('2. Gehen Sie zu "SQL Editor"');
console.log('3. Führen Sie die folgenden Dateien in dieser Reihenfolge aus:\n');

const sqlFiles = ['schema.sql', 'rls.sql', 'seed.sql'];

sqlFiles.forEach((file, index) => {
  const filePath = path.join(__dirname, 'sql', file);
  if (fs.existsSync(filePath)) {
    console.log(`${index + 1}. ${file}`);
    console.log('   Inhalt:');
    const content = fs.readFileSync(filePath, 'utf8');
    console.log('   ' + content.split('\n').join('\n   '));
    console.log('\n   --- Kopieren Sie den obigen Inhalt in den SQL Editor ---\n');
  }
});

console.log('4. Nach dem Ausführen aller SQL-Dateien:');
console.log('   - Überprüfen Sie, ob alle Tabellen erstellt wurden');
console.log('   - Überprüfen Sie, ob die 8 Teams (A-H) eingefügt wurden');
console.log('   - Überprüfen Sie, ob die 5 Quiz-Fragen eingefügt wurden');
console.log('\n5. Starten Sie die Anwendung mit: npm run dev');
console.log('\n✅ Setup abgeschlossen!');

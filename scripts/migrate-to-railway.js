#!/usr/bin/env node

/**
 * Script para migrar banco de dados local para Railway
 * Uso: node scripts/migrate-to-railway.js
 */

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Configurações do banco local
const LOCAL_CONFIG = {
  host: 'localhost',
  database: 'sysobras',
  username: 'postgres',
  password: 'admin',
  dialect: 'postgres'
};

// Configurações do Railway (serão preenchidas via env)
const RAILWAY_CONFIG = {
  host: process.env.RAILWAY_DB_HOST,
  database: process.env.RAILWAY_DB_NAME,
  username: process.env.RAILWAY_DB_USER,
  password: process.env.RAILWAY_DB_PASS,
  dialect: 'postgres'
};

async function migrateDatabase() {
  console.log('🚀 Iniciando migração do banco de dados...');
  
  // Verificar se as variáveis do Railway estão definidas
  if (!RAILWAY_CONFIG.host || !RAILWAY_CONFIG.database) {
    console.error('❌ Variáveis de ambiente do Railway não encontradas!');
    console.log('Configure as seguintes variáveis:');
    console.log('- RAILWAY_DB_HOST');
    console.log('- RAILWAY_DB_NAME');
    console.log('- RAILWAY_DB_USER');
    console.log('- RAILWAY_DB_PASS');
    process.exit(1);
  }

  const localDb = new Sequelize(LOCAL_CONFIG);
  const railwayDb = new Sequelize(RAILWAY_CONFIG);

  try {
    // Testar conexões
    console.log('🔌 Testando conexões...');
    await localDb.authenticate();
    console.log('✅ Conexão com banco local: OK');
    
    await railwayDb.authenticate();
    console.log('✅ Conexão com Railway: OK');

    // Listar tabelas
    const tables = await localDb.getQueryInterface().showAllTables();
    console.log(`📋 Encontradas ${tables.length} tabelas:`);
    tables.forEach(table => console.log(`  - ${table}`));

    // Migrar cada tabela
    for (const table of tables) {
      console.log(`\n🔄 Migrando tabela: ${table}`);
      
      // Obter estrutura da tabela
      const tableInfo = await localDb.getQueryInterface().describeTable(table);
      
      // Criar tabela no Railway (se não existir)
      try {
        await railwayDb.getQueryInterface().describeTable(table);
        console.log(`  ✅ Tabela ${table} já existe no Railway`);
      } catch (error) {
        console.log(`  🏗️ Criando tabela ${table} no Railway...`);
        // Aqui você precisaria implementar a criação da tabela
        // baseada na estrutura obtida
      }

      // Migrar dados
      const data = await localDb.query(`SELECT * FROM "${table}"`, {
        type: Sequelize.QueryTypes.SELECT
      });

      if (data.length > 0) {
        console.log(`  📊 Migrando ${data.length} registros...`);
        
        // Limpar dados existentes
        await railwayDb.query(`DELETE FROM "${table}"`);
        
        // Inserir novos dados
        for (const row of data) {
          await railwayDb.query(`INSERT INTO "${table}" (${Object.keys(row).join(', ')}) VALUES (${Object.values(row).map(v => `'${v}'`).join(', ')})`);
        }
        
        console.log(`  ✅ ${data.length} registros migrados com sucesso`);
      } else {
        console.log(`  ℹ️ Tabela ${table} está vazia`);
      }
    }

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('✅ Todos os dados foram migrados para o Railway');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    process.exit(1);
  } finally {
    await localDb.close();
    await railwayDb.close();
  }
}

// Executar migração
if (require.main === module) {
  migrateDatabase().catch(console.error);
}

module.exports = { migrateDatabase };

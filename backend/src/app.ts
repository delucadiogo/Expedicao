import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expeditionRoutes from './routes/expedition.routes';
import driverRoutes from './routes/driver.routes';
import truckRoutes from './routes/truck.routes';
import transportCompanyRoutes from './routes/transportCompany.routes';
import productCatalogRoutes from './routes/productCatalog.routes';
import expeditionResponsibleRoutes from './routes/expeditionResponsible.routes';
import supplierRoutes from './routes/supplier.routes';
import qualityResponsibleRoutes from './routes/qualityResponsible.routes';
import authRoutes from './routes/authRoutes';
import { testConnection } from './config/database';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Configuração do CORS
app.use(cors({
  origin: true, // Permite todas as origens
  credentials: true, // Permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Rota de health check (antes das outras rotas)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api', expeditionRoutes);
app.use('/api', driverRoutes);
app.use('/api', truckRoutes);
app.use('/api', transportCompanyRoutes);
app.use('/api', productCatalogRoutes);
app.use('/api/expedition-responsibles', expeditionResponsibleRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/quality-responsibles', qualityResponsibleRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando!', timestamp: new Date().toISOString() });
});

// Inicializar servidor
const PORT = process.env.PORT || 3001;

// Testar conexão com o banco de dados antes de iniciar o servidor
testConnection().then(() => {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Health check disponível em: http://localhost:${PORT}/health`);
    console.log(`Teste da API disponível em: http://localhost:${PORT}/api/test`);
  });
}).catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
}); 
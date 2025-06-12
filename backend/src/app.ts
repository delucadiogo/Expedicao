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

// Middleware
app.use(cors());
app.use(express.json());

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

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;

// Testar conexão com o banco de dados antes de iniciar o servidor
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
}); 
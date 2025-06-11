
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpeditionProvider } from '@/contexts/ExpeditionContext';
import Dashboard from '@/components/expedition/Dashboard';
import ExpeditionForm from '@/components/expedition/ExpeditionForm';
import ExpeditionList from '@/components/expedition/ExpeditionList';
import { Truck, Plus, List, BarChart3, LogOut, Printer, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PrintExpedition from '@/components/expedition/PrintExpedition';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [printMode, setPrintMode] = useState(false);
  const [printData, setPrintData] = useState<any>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePrint = (data?: any) => {
    setPrintData(data || {});
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  if (printMode) {
    return <PrintExpedition data={printData} onClose={() => setPrintMode(false)} />;
  }

  return (
    <ExpeditionProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://www.oliveira.com.br/wp-content/uploads/2023/09/logo_oliveira_ver_01.png" 
                  alt="Oliveira Logo" 
                  className="h-10" 
                />
                <div>
                  <h1 className="text-2xl font-bold">Sistema de Controle de Expedição</h1>
                  <p className="text-sm text-muted-foreground">
                    Gestão completa de expedições, qualidade e controle de produtos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/cadastros')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Cadastros
                </Button>
                <div className="text-right">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Expedição</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span>Expedições</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard />
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Nova Expedição</h2>
                    <p className="text-muted-foreground">
                      Cadastre uma nova expedição no sistema
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handlePrint()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir Formulário Vazio
                  </Button>
                </div>
                <ExpeditionForm onSuccess={() => setActiveTab('list')} />
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <ExpeditionList onPrintRequest={handlePrint} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ExpeditionProvider>
  );
};

export default Index;

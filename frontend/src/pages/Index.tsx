import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpeditionProvider } from '@/contexts/ExpeditionContext';
import Dashboard from '@/components/expedition/Dashboard';
import ExpeditionForm from '@/components/expedition/ExpeditionForm';
import ExpeditionList from '@/components/expedition/ExpeditionList';
import { Truck, Plus, List, BarChart3, LogOut, Settings, Printer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import PrintableNewExpeditionForm from '@/components/expedition/PrintableNewExpeditionForm';

const Index = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isPrintableFormOpen, setIsPrintableFormOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'list') {
      return 'list';
    } else if (tab === 'new') {
      return 'new';
    } else {
      return 'dashboard';
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/?tab=${value}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePrintableForm = () => {
    setIsPrintableFormOpen(true);
    setTimeout(() => {
      window.print();
      setIsPrintableFormOpen(false);
    }, 500);
  };

  if (isPrintableFormOpen) {
    return <PrintableNewExpeditionForm onClose={() => setIsPrintableFormOpen(false)} />;
  }

  return (
    <ExpeditionProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 w-full sm:w-auto">
                <img 
                  src="https://www.oliveira.com.br/wp-content/uploads/2023/09/logo_oliveira_ver_01.png" 
                  alt="Oliveira Logo" 
                  className="h-8 sm:h-10 mb-2 sm:mb-0" 
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-lg sm:text-2xl font-bold leading-tight">Sistema de Controle de Expedição</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                    Gestão completa de expedições, qualidade e controle de produtos
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-4 w-full sm:w-auto mt-2 sm:mt-0">
                <Button variant="outline" size="sm" onClick={() => navigate('/cadastros')} className="w-full sm:w-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Cadastros
                </Button>
                <div className="text-center sm:text-right w-full sm:w-auto">
                  <p className="font-medium text-sm sm:text-base">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => handleTabChange('new')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                    <Button variant="outline" onClick={handlePrintableForm}>
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir Ficha Manual
                    </Button>
                  </div>
                </div>
                <ExpeditionForm onSuccess={() => handleTabChange('list')} />
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <ExpeditionList onPrintRequest={() => { /* Lógica de impressão agora no App.tsx */ }} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ExpeditionProvider>
  );
};

export default Index;

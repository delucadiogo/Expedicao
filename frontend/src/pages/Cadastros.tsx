
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Truck, Building, Package, UserCheck, Factory, Clipboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CadastroMotoristas from '@/components/cadastros/CadastroMotoristas';
import CadastroCaminhoes from '@/components/cadastros/CadastroCaminhoes';
import CadastroEmpresas from '@/components/cadastros/CadastroEmpresas';
import CadastroProdutos from '@/components/cadastros/CadastroProdutos';
import CadastroResponsaveis from '@/components/cadastros/CadastroResponsaveis';
import CadastroFornecedores from '@/components/cadastros/CadastroFornecedores';
import CadastroQualidade from '@/components/cadastros/CadastroQualidade';

type CadastroType = 'motoristas' | 'caminhoes' | 'empresas' | 'produtos' | 'responsaveis' | 'fornecedores' | 'qualidade' | null;

const Cadastros = () => {
  const [selectedCadastro, setSelectedCadastro] = useState<CadastroType>(null);
  const navigate = useNavigate();

  const cadastroOptions = [
    {
      type: 'motoristas' as CadastroType,
      title: 'Motoristas',
      description: 'Cadastrar e gerenciar motoristas',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      type: 'caminhoes' as CadastroType,
      title: 'Caminhões',
      description: 'Cadastrar e gerenciar veículos',
      icon: Truck,
      color: 'bg-green-500'
    },
    {
      type: 'empresas' as CadastroType,
      title: 'Empresas de Transporte',
      description: 'Cadastrar transportadoras',
      icon: Building,
      color: 'bg-purple-500'
    },
    {
      type: 'produtos' as CadastroType,
      title: 'Produtos',
      description: 'Cadastrar produtos e itens',
      icon: Package,
      color: 'bg-orange-500'
    },
    {
      type: 'responsaveis' as CadastroType,
      title: 'Responsáveis de Expedição',
      description: 'Cadastrar responsáveis internos',
      icon: UserCheck,
      color: 'bg-cyan-500'
    },
    {
      type: 'fornecedores' as CadastroType,
      title: 'Fornecedores',
      description: 'Cadastrar fornecedores',
      icon: Factory,
      color: 'bg-red-500'
    },
    {
      type: 'qualidade' as CadastroType,
      title: 'Responsáveis da Qualidade',
      description: 'Cadastrar responsáveis de qualidade',
      icon: Clipboard,
      color: 'bg-indigo-500'
    }
  ];

  if (selectedCadastro) {
    const renderCadastro = () => {
      switch (selectedCadastro) {
        case 'motoristas':
          return <CadastroMotoristas onBack={() => setSelectedCadastro(null)} />;
        case 'caminhoes':
          return <CadastroCaminhoes onBack={() => setSelectedCadastro(null)} />;
        case 'empresas':
          return <CadastroEmpresas onBack={() => setSelectedCadastro(null)} />;
        case 'produtos':
          return <CadastroProdutos onBack={() => setSelectedCadastro(null)} />;
        case 'responsaveis':
          return <CadastroResponsaveis onBack={() => setSelectedCadastro(null)} />;
        case 'fornecedores':
          return <CadastroFornecedores onBack={() => setSelectedCadastro(null)} />;
        case 'qualidade':
          return <CadastroQualidade onBack={() => setSelectedCadastro(null)} />;
        default:
          return null;
      }
    };

    return renderCadastro();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Sistema
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Cadastros Gerais</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie todos os cadastros do sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cadastroOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.type} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCadastro(option.type)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${option.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{option.description}</p>
                  <Button variant="outline" className="w-full mt-4">
                    Gerenciar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Cadastros;

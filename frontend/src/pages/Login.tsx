import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { log } from '@/lib/log';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    log.debug('Login: verificando autenticação...', isAuthenticated);
    if (isAuthenticated) {
      log.info('Login: usuário já autenticado, redirecionando...');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    log.debug('Login: tentando fazer login...');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      log.debug('Login: resultado do login:', success);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o sistema...",
        });
        // O redirecionamento será feito pelo useEffect quando isAuthenticated mudar
      } else {
        toast({
          title: "Erro de Login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      log.error('Login: erro durante login:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <img 
            src="https://www.oliveira.com.br/wp-content/uploads/2023/09/logo_oliveira_ver_01.png" 
            alt="Oliveira Logo" 
            className="h-16" 
          />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sistema de Controle de Expedição</CardTitle>
            <CardDescription>Entre com seus dados para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@oliveira.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              
              <div className="mt-4 text-center text-sm">
                Não tem uma conta?
                <Button variant="link" onClick={() => navigate('/register')} className="p-0 h-auto align-baseline text-blue-500 hover:text-blue-700">
                  Cadastre-se
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© 2023-{new Date().getFullYear()} Oliveira - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Login;

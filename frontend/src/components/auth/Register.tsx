import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'expedição' | 'qualidade' | 'suprimentos' | 'admin' | string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !role) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const success = await register(username, email, password, role as 'expedição' | 'qualidade' | 'suprimentos' | 'admin');
      
      if (success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Seu cadastro foi realizado com sucesso e está aguardando aprovação. Você será redirecionado para a página de login.",
        });
        navigate('/login');
      } else {
        setError('Erro ao cadastrar usuário. Verifique se o email já está em uso ou tente novamente.');
        toast({
          title: "Erro no Cadastro",
          description: "Não foi possível realizar o cadastro.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Erro ao tentar registrar:', err);
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro ao tentar cadastrar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Insira seus dados abaixo para criar uma nova conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
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
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo/Permissão</Label>
              <Select onValueChange={(value) => setRole(value as 'expedição' | 'qualidade' | 'suprimentos' | 'admin')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expedição">Expedição</SelectItem>
                  <SelectItem value="qualidade">Qualidade</SelectItem>
                  <SelectItem value="suprimentos">Suprimentos</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Cadastrar</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto align-baseline text-blue-500 hover:text-blue-700">
              Faça login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register; 
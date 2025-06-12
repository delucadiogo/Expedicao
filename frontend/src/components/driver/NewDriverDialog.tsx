import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { driverService } from '@/lib/api';
import { CreateDriverDTO, Driver } from '@/types/driver';
import { useToast } from '@/hooks/use-toast';

interface NewDriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDriver: Driver) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cnh: z.string().min(1, 'CNH é obrigatória'),
  cnhExpirationDate: z.string().min(1, 'Data de validade da CNH é obrigatória'),
});

export default function NewDriverDialog({ isOpen, onClose, onSuccess }: NewDriverDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      document: '',
      phone: '',
      email: '',
      cnh: '',
      cnhExpirationDate: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newDriver: CreateDriverDTO = {
        name: values.name,
        document: values.document,
        phone: values.phone || undefined,
        email: values.email || undefined,
        cnh: values.cnh,
        cnhExpirationDate: values.cnhExpirationDate,
      };
      const createdDriver = await driverService.create(newDriver);
      toast({
        title: 'Sucesso',
        description: 'Motorista cadastrado com sucesso!',
        variant: 'success',
      });
      onSuccess(createdDriver);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar motorista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o motorista.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Motorista</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNH</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnhExpirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade CNH</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Cadastrar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
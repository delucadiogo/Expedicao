import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { qualityResponsibleService } from '@/lib/api';
import { CreateQualityResponsibleDTO, QualityResponsible } from '@/types/qualityResponsible';
import { useToast } from '@/hooks/use-toast';

interface NewQualityResponsibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newQualityResponsible: QualityResponsible) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  sector: z.string().min(1, 'Setor é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  digitalSignature: z.string().optional(),
});

export default function NewQualityResponsibleDialog({ isOpen, onClose, onSuccess }: NewQualityResponsibleDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      position: '',
      sector: '',
      email: '',
      phone: '',
      digitalSignature: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newQualityResponsible: CreateQualityResponsibleDTO = {
        name: values.name,
        position: values.position,
        sector: values.sector,
        email: values.email || undefined,
        phone: values.phone || undefined,
        digitalSignature: values.digitalSignature || undefined,
      };
      const createdQualityResponsible = await qualityResponsibleService.create(newQualityResponsible);
      toast({
        title: 'Sucesso',
        description: 'Responsável pela qualidade cadastrado com sucesso!',
        variant: 'default',
      });
      onSuccess(createdQualityResponsible);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar responsável pela qualidade:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o responsável pela qualidade.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Responsável pela Qualidade</DialogTitle>
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
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
              name="digitalSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assinatura Digital</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
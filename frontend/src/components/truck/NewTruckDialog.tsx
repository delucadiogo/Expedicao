import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { truckService } from '@/lib/api';
import { CreateTruckDTO, Truck } from '@/types/truck';
import { useToast } from '@/hooks/use-toast';

interface NewTruckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTruck: Truck) => void;
}

const formSchema = z.object({
  plate: z.string().min(1, 'Placa é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  year: z.coerce.number().min(1900, 'Ano inválido').max(new Date().getFullYear(), 'Ano não pode ser no futuro'),
  axles: z.coerce.number().min(1, 'Eixos é obrigatório'),
  capacity: z.coerce.number().min(1, 'Capacidade é obrigatória'),
});

export default function NewTruckDialog({ isOpen, onClose, onSuccess }: NewTruckDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: '',
      model: '',
      brand: '',
      year: new Date().getFullYear(),
      axles: 2,
      capacity: 1000,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newTruck: CreateTruckDTO = {
        plate: values.plate.toUpperCase(), // Armazenar placa em maiúsculas
        model: values.model,
        brand: values.brand,
        year: values.year,
        axles: values.axles,
        capacity: values.capacity,
      };
      const createdTruck = await truckService.create(newTruck);
      toast({
        title: 'Sucesso',
        description: 'Caminhão cadastrado com sucesso!',
        variant: 'success',
      });
      onSuccess(createdTruck);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar caminhão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o caminhão.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Caminhão</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="axles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eixos</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
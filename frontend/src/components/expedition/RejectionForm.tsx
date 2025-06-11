import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpeditionStatus } from '@/types/expedition';

const formSchema = z.object({
  reason: z.string().min(1, 'Motivo é obrigatório'),
  sentToSupplies: z.boolean().default(false),
  cargoRetained: z.boolean().default(false),
  retentionLocation: z.string().optional(),
  retainedQuantity: z.string().optional(),
  correctiveActions: z.string().optional(),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
});

interface RejectionFormProps {
  expeditionId: string;
  onSuccess?: () => void;
}

export default function RejectionForm({ expeditionId, onSuccess }: RejectionFormProps) {
  const { expeditions, updateExpedition } = useExpeditionContext();
  const expedition = expeditions.find((e) => e.id === expeditionId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: expedition?.rejection?.reason || '',
      sentToSupplies: expedition?.rejection?.sentToSupplies || false,
      cargoRetained: expedition?.rejection?.cargoRetained || false,
      retentionLocation: expedition?.rejection?.retentionLocation || '',
      retainedQuantity: expedition?.rejection?.retainedQuantity || '',
      correctiveActions: expedition?.rejection?.correctiveActions || '',
      responsible: expedition?.rejection?.responsible || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!expedition) return;

    try {
      await updateExpedition(expeditionId, {
        ...expedition,
        status: 'rejeitado' as ExpeditionStatus,
        rejection: {
          ...expedition.rejection,
          ...values,
          rejectionDateTime: new Date().toISOString(),
        },
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atualizar rejeição:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo da Rejeição</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="qualidade">Problemas de Qualidade</SelectItem>
                  <SelectItem value="documentacao">Documentação Incompleta</SelectItem>
                  <SelectItem value="quantidade">Quantidade Incorreta</SelectItem>
                  <SelectItem value="prazo">Fora do Prazo</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sentToSupplies"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Encaminhado para Suprimentos</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargoRetained"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Carga Retida</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {form.watch('cargoRetained') && (
          <>
            <FormField
              control={form.control}
              name="retentionLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local de Retenção</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retainedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade Retida</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="correctiveActions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ações Corretivas</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
} 
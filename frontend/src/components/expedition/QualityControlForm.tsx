import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ExpeditionStatus } from '@/types/expedition';

const formSchema = z.object({
  justification: z.string().min(1, 'Justificativa é obrigatória'),
  digitalSignature: z.string().min(1, 'Assinatura digital é obrigatória'),
  observations: z.string().optional(),
});

interface QualityControlFormProps {
  expeditionId: string;
  onSuccess?: () => void;
}

export default function QualityControlForm({ expeditionId, onSuccess }: QualityControlFormProps) {
  const { expeditions, updateExpedition } = useExpeditionContext();
  const expedition = expeditions.find((e) => e.id === expeditionId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      justification: expedition?.qualityControl.justification || '',
      digitalSignature: expedition?.qualityControl.digitalSignature || '',
      observations: expedition?.qualityControl.observations || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!expedition) return;

    try {
      await updateExpedition(expeditionId, {
        ...expedition,
        qualityControl: {
          ...expedition.qualityControl,
          ...values,
          analysisDateTime: new Date().toISOString(),
        },
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atualizar controle de qualidade:', error);
    }
  };

  const handleApprove = async () => {
    if (!expedition) return;

    try {
      await updateExpedition(expeditionId, {
        ...expedition,
        status: 'aprovado' as ExpeditionStatus,
        qualityControl: {
          ...expedition.qualityControl,
          approvalStatus: 'aprovado',
          analysisDateTime: new Date().toISOString(),
        },
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao aprovar expedição:', error);
    }
  };

  const handleReject = async () => {
    if (!expedition) return;

    try {
      await updateExpedition(expeditionId, {
        ...expedition,
        status: 'rejeitado' as ExpeditionStatus,
        qualityControl: {
          ...expedition.qualityControl,
          approvalStatus: 'rejeitado',
          analysisDateTime: new Date().toISOString(),
        },
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao rejeitar expedição:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justificativa</FormLabel>
              <FormControl>
                <Textarea {...field} />
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

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleReject}>
            Rejeitar
          </Button>
          <Button type="button" variant="outline" onClick={handleApprove}>
            Aprovar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
} 
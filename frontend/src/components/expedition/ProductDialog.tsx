import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/types/expedition';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: any) => void;
}

export default function ProductDialog({ isOpen, onClose, product, onSubmit }: ProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={onSubmit}
          onCancel={() => onClose(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 
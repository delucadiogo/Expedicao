import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/types/expedition';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-500';
      case 'rejeitado':
        return 'bg-red-500';
      case 'pendente':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum produto encontrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nome</th>
                    <th className="text-left py-2">Código</th>
                    <th className="text-left py-2">Quantidade</th>
                    <th className="text-left py-2">Lote</th>
                    <th className="text-left py-2">Validade</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-right py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2">{product.code}</td>
                      <td className="py-2">
                        {product.quantity} {product.unit}
                      </td>
                      <td className="py-2">{product.batch || '-'}</td>
                      <td className="py-2">
                        {product.expiryDate
                          ? new Date(product.expiryDate + 'T00:00:00').toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="py-2">
                        <Badge className={getStatusColor(product.status)}>
                          {formatStatus(product.status)}
                        </Badge>
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(product)}
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(product)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
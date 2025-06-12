import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useExpeditionContext } from '@/contexts/ExpeditionContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { ExpeditionStatus, Product, CreateExpeditionDTO } from '@/types/expedition';
import ProductDialog from './ProductDialog';
import ProductList from './ProductList';
import { driverService } from '@/lib/api';
import { Driver } from '@/types/driver';
import { transportCompanyService } from '@/lib/api';
import { TransportCompany } from '@/types/transportCompany';
import { supplierService } from '@/lib/api';
import { Supplier } from '@/types/supplier';
import { expeditionResponsibleService } from '@/lib/api';
import { ExpeditionResponsible } from '@/types/expeditionResponsible';
import { Combobox } from '@/components/ui/combobox';
import { truckService } from '@/lib/api';
import { Truck } from '@/types/truck';
import { qualityResponsibleService } from '@/lib/api';
import { QualityResponsible } from '@/types/qualityResponsible';
import NewTruckDialog from '@/components/truck/NewTruckDialog';
import NewDriverDialog from '@/components/driver/NewDriverDialog';
import NewTransportCompanyDialog from '@/components/transportCompany/NewTransportCompanyDialog';
import NewSupplierDialog from '@/components/supplier/NewSupplierDialog';
import NewExpeditionResponsibleDialog from '@/components/expeditionResponsible/NewExpeditionResponsibleDialog';
import NewQualityResponsibleDialog from '@/components/qualityResponsible/NewQualityResponsibleDialog';

const formSchema = z.object({
  expeditionNumber: z.string().min(1, 'Número da expedição é obrigatório'),
  truckPlate: z.string().min(1, 'Placa é obrigatória'),
  driverName: z.string().min(1, 'Nome do motorista é obrigatório'),
  driverDocument: z.string().min(1, 'Documento do motorista é obrigatório'),
  transportCompany: z.string().optional(),
  supplierName: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  supplierDocument: z.string().min(1, 'CNPJ do fornecedor é obrigatório'),
  expeditionResponsible: z.string().min(1, 'Responsável é obrigatório'),
  responsiblePosition: z.string().optional(),
  products: z.array(z.any()).min(1, 'Pelo menos um produto é obrigatório'),
  qualityControl: z.object({
    responsibleName: z.string().min(1, 'Responsável é obrigatório'),
    approvalStatus: z.enum(['aprovado', 'rejeitado', 'pendente']),
    justification: z.string().optional(),
    digitalSignature: z.string().optional(),
    observations: z.string().optional(),
  }),
});

interface ExpeditionFormProps {
  onSuccess?: () => void;
}

export default function ExpeditionForm({ onSuccess }: ExpeditionFormProps) {
  const { createExpedition } = useExpeditionContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [transportCompanies, setTransportCompanies] = useState<TransportCompany[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [expeditionResponsibles, setExpeditionResponsibles] = useState<ExpeditionResponsible[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [qualityResponsibles, setQualityResponsibles] = useState<QualityResponsible[]>([]);
  const [isNewTruckDialogOpen, setIsNewTruckDialogOpen] = useState(false);
  const [isNewDriverDialogOpen, setIsNewDriverDialogOpen] = useState(false);
  const [isNewTransportCompanyDialogOpen, setIsNewTransportCompanyDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  const [isNewExpeditionResponsibleDialogOpen, setIsNewExpeditionResponsibleDialogOpen] = useState(false);
  const [isNewQualityResponsibleDialogOpen, setIsNewQualityResponsibleDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await driverService.getAll();
        setDrivers(data);
      } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchTransportCompanies = async () => {
      try {
        const data = await transportCompanyService.getAll();
        setTransportCompanies(data);
      } catch (error) {
        console.error('Erro ao carregar empresas de transporte:', error);
      }
    };
    fetchTransportCompanies();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await supplierService.getAll();
        setSuppliers(data);
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchExpeditionResponsibles = async () => {
      try {
        const data = await expeditionResponsibleService.getAll();
        setExpeditionResponsibles(data);
      } catch (error) {
        console.error('Erro ao carregar responsáveis de expedição:', error);
      }
    };
    fetchExpeditionResponsibles();
  }, []);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        console.log('Tentando carregar caminhões...');
        const data = await truckService.getAll();
        console.log('Caminhões carregados:', data);
        setTrucks(data);
      } catch (error) {
        console.error('Erro ao carregar caminhões:', error);
      }
    };
    fetchTrucks();
  }, []);

  useEffect(() => {
    const fetchQualityResponsibles = async () => {
      try {
        const data = await qualityResponsibleService.getAll();
        setQualityResponsibles(data);
      } catch (error) {
        console.error('Erro ao carregar responsáveis de qualidade:', error);
      }
    };
    fetchQualityResponsibles();
  }, []);

  const generateExpeditionNumber = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `EXP-${year}${month}${day}-${random}`;
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expeditionNumber: generateExpeditionNumber(),
      truckPlate: '',
      driverName: '',
      driverDocument: '',
      transportCompany: '',
      supplierName: '',
      supplierDocument: '',
      expeditionResponsible: '',
      responsiblePosition: '',
      products: [],
      qualityControl: {
        responsibleName: '',
        approvalStatus: 'pendente',
        justification: '',
        digitalSignature: '',
        observations: '',
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Tentando criar expedição...');
    try {
      const expeditionData: CreateExpeditionDTO = {
        expeditionNumber: values.expeditionNumber,
        truckPlate: values.truckPlate,
        driverName: values.driverName,
        driverDocument: values.driverDocument,
        transportCompany: values.transportCompany,
        supplierName: values.supplierName,
        supplierDocument: values.supplierDocument,
        expeditionResponsible: values.expeditionResponsible,
        responsiblePosition: values.responsiblePosition,
        products: products,
        status: 'pendente',
        qualityControl: {
          responsibleName: values.qualityControl.responsibleName,
          approvalStatus: values.qualityControl.approvalStatus,
          justification: values.qualityControl.justification,
          digitalSignature: values.qualityControl.digitalSignature,
          observations: values.qualityControl.observations,
        },
        dateTime: new Date().toISOString(),
      };

      await createExpedition(expeditionData);
      form.reset({
        ...form.getValues(),
        expeditionNumber: generateExpeditionNumber(),
      });
      setProducts([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao criar expedição:', error);
    }
  };

  const handleAddProduct = (product: Product) => {
    let updatedProducts;
    if (productToEdit) {
      updatedProducts = products.map((p) => (p.id === product.id ? product : p));
    } else {
      updatedProducts = [...products, { ...product, id: Date.now().toString() }];
    }
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
    setProductToEdit(undefined);
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    const updatedProducts = products.filter((p) => p.id !== product.id);
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
  };

  const handleTransportCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const companyName = e.target.value;
    form.setValue('transportCompany', companyName);

    const matchedCompany = transportCompanies.find(company =>
      company.name.toLowerCase() === companyName.toLowerCase()
    );

    if (matchedCompany) {
      form.setValue('transportCompany', matchedCompany.name);
    } else {
      // Opcional: Limpar campos relacionados se não houver correspondência exata
    }
  };

  const handleSupplierNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('supplierName', name);

    const matchedSuppliers = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(name.toLowerCase())
    );

    if (matchedSuppliers.length === 1) {
      form.setValue('supplierDocument', matchedSuppliers[0].document);
    } else {
      form.setValue('supplierDocument', '');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Informações da Expedição</CardTitle>
        </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expeditionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Expedição</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Transporte</CardTitle>
        </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="truckPlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do Caminhão</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Combobox
                          options={trucks.map(truck => ({ label: truck.plate, value: truck.plate }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Selecione ou digite a placa..."
                          displayField="label"
                          valueField="value"
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => setIsNewTruckDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Motorista</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Combobox
                          options={drivers.map(driver => ({ label: driver.name, value: driver.id }))}
                          value={field.value}
                          onValueChange={(id) => {
                            field.onChange(id);
                            const selectedDriver = drivers.find(d => d.id === id);
                            if (selectedDriver) {
                              form.setValue('driverDocument', selectedDriver.document);
                            } else {
                              form.setValue('driverDocument', '');
                            }
                          }}
                          placeholder="Selecione ou digite o motorista..."
                          displayField="label"
                          valueField="value"
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => setIsNewDriverDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento do Motorista</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transportCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa de Transporte (Opcional)</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Combobox
                          options={transportCompanies.map(company => ({ label: company.name, value: company.id }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Selecione ou digite a empresa..."
                          displayField="label"
                          valueField="value"
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => setIsNewTransportCompanyDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Informações do Fornecedor</CardTitle>
        </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Fornecedor</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Combobox
                          options={suppliers.map(supplier => ({ label: supplier.name, value: supplier.id }))}
                          value={field.value}
                          onValueChange={(id) => {
                            field.onChange(id);
                            const selectedSupplier = suppliers.find(s => s.id === id);
                            if (selectedSupplier) {
                              form.setValue('supplierDocument', selectedSupplier.document);
                            } else {
                              form.setValue('supplierDocument', '');
                            }
                          }}
                          placeholder="Selecione ou digite o fornecedor..."
                          displayField="label"
                          valueField="value"
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => setIsNewSupplierDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento do Fornecedor</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Responsável</CardTitle>
        </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expeditionResponsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pela Expedição</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Combobox
                          options={expeditionResponsibles.map(responsible => ({ label: responsible.name, value: responsible.id }))}
                          value={field.value}
                          onValueChange={(id) => {
                            field.onChange(id);
                            const selectedResponsible = expeditionResponsibles.find(r => r.id === id);
                            if (selectedResponsible) {
                              form.setValue('responsiblePosition', selectedResponsible.position);
                            } else {
                              form.setValue('responsiblePosition', '');
                            }
                          }}
                          placeholder="Selecione ou digite o responsável..."
                          displayField="label"
                          valueField="value"
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => setIsNewExpeditionResponsibleDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsiblePosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo/Setor</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Produtos da Expedição</CardTitle>
        </CardHeader>
          <CardContent>
          <Button type="button" onClick={() => setIsProductDialogOpen(true)} className="mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
          </Button>
          <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />

          {form.formState.errors.products && (
            <FormMessage>{form.formState.errors.products.message}</FormMessage>
          )}

          <ProductDialog
              open={isProductDialogOpen}
              onOpenChange={(open) => {
                setIsProductDialogOpen(open);
                if (!open) {
                  setProductToEdit(undefined);
                }
              }}
              onSubmit={handleAddProduct}
              product={productToEdit}
          />

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Controle de Qualidade</CardTitle>
        </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qualityControl.responsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pela Qualidade</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Combobox
                          options={qualityResponsibles.map(responsible => ({ label: responsible.name, value: responsible.id }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Selecione ou digite o responsável..."
                          displayField="label"
                          valueField="value"
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => setIsNewQualityResponsibleDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.approvalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status de Aprovação</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.justification"
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
                name="qualityControl.digitalSignature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assinatura Digital</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityControl.observations"
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
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
          Criar Expedição
      </Button>
      </form>

      <NewTruckDialog
        isOpen={isNewTruckDialogOpen}
        onClose={() => setIsNewTruckDialogOpen(false)}
        onSuccess={(newTruck) => {
          setTrucks((prevTrucks) => [...prevTrucks, newTruck]);
          form.setValue('truckPlate', newTruck.plate);
          setIsNewTruckDialogOpen(false);
        }}
      />

      <NewDriverDialog
        isOpen={isNewDriverDialogOpen}
        onClose={() => setIsNewDriverDialogOpen(false)}
        onSuccess={(newDriver) => {
          setDrivers((prevDrivers) => [...prevDrivers, newDriver]);
          form.setValue('driverName', newDriver.id);
          form.setValue('driverDocument', newDriver.document);
          setIsNewDriverDialogOpen(false);
        }}
      />

      <NewTransportCompanyDialog
        isOpen={isNewTransportCompanyDialogOpen}
        onClose={() => setIsNewTransportCompanyDialogOpen(false)}
        onSuccess={(newTransportCompany) => {
          setTransportCompanies((prevCompanies) => [...prevCompanies, newTransportCompany]);
          form.setValue('transportCompany', newTransportCompany.id);
          setIsNewTransportCompanyDialogOpen(false);
        }}
      />

      <NewSupplierDialog
        isOpen={isNewSupplierDialogOpen}
        onClose={() => setIsNewSupplierDialogOpen(false)}
        onSuccess={(newSupplier) => {
          setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
          form.setValue('supplierName', newSupplier.id);
          form.setValue('supplierDocument', newSupplier.document);
          setIsNewSupplierDialogOpen(false);
        }}
      />

      <NewExpeditionResponsibleDialog
        isOpen={isNewExpeditionResponsibleDialogOpen}
        onClose={() => setIsNewExpeditionResponsibleDialogOpen(false)}
        onSuccess={(newExpeditionResponsible) => {
          setExpeditionResponsibles((prevResponsibles) => [...prevResponsibles, newExpeditionResponsible]);
          form.setValue('expeditionResponsible', newExpeditionResponsible.id);
          form.setValue('responsiblePosition', newExpeditionResponsible.position);
          setIsNewExpeditionResponsibleDialogOpen(false);
        }}
      />

      <NewQualityResponsibleDialog
        isOpen={isNewQualityResponsibleDialogOpen}
        onClose={() => setIsNewQualityResponsibleDialogOpen(false)}
        onSuccess={(newQualityResponsible) => {
          setQualityResponsibles((prevResponsibles) => [...prevResponsibles, newQualityResponsible]);
          form.setValue('qualityControl.responsibleName', newQualityResponsible.id);
          setIsNewQualityResponsibleDialogOpen(false);
        }}
      />
    </Form>
  );
}

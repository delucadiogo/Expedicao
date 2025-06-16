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
import { ExpeditionStatus, Product, CreateExpeditionDTO, Expedition } from '@/types/expedition';
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
import NewProductDialog from '@/components/product/NewProductDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCatalog } from '@/types/productCatalog';
import { productCatalogService } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Helper function to format an ISO string date to 'YYYY-MM-DD' for input type="date"
const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format an ISO string date for display (e.g., in tables)
const formatDateForDisplay = (dateString?: string): string => {
  if (!dateString) return '';
  // Criar a data usando o construtor que aceita UTC, ou tratar como local
  // Se a string já é YYYY-MM-DD, tratá-la como local
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Se for YYYY-MM-DD, adicionar T00:00:00 para garantir que seja interpretado no fuso horário local
    return new Date(dateString + 'T00:00:00').toLocaleDateString();
  } else {
    // Se for ISO string completa, usar diretamente
    return new Date(dateString).toLocaleDateString();
  }
};

// Função auxiliar para formatar ISO string para entrada de data e hora (YYYY-MM-DDTHH:MM)
const formatDateTimeForForm = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
  status: z.enum(['pendente', 'em_analise', 'aprovado', 'rejeitado', 'retido']),
  dateTime: z.string().optional(),
  arrivalDateTime: z.string().optional(),
});

interface ExpeditionFormProps {
  onSuccess?: () => void;
  initialData?: Expedition;
  onSubmit: (data: any) => Promise<void>;
}

export default function ExpeditionForm({ onSuccess, initialData, onSubmit }: ExpeditionFormProps) {
  const { createExpedition } = useExpeditionContext();
  const [products, setProducts] = useState<Product[]>(initialData?.products || []);
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
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [productCatalog, setProductCatalog] = useState<ProductCatalog[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchProductCatalog = async () => {
      try {
        const data = await productCatalogService.getAll();
        setProductCatalog(data);
      } catch (error) {
        console.error('Erro ao carregar catálogo de produtos:', error);
      }
    };
    fetchProductCatalog();
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
      expeditionNumber: initialData?.expeditionNumber || generateExpeditionNumber(),
      truckPlate: initialData?.truckPlate || '',
      driverName: initialData?.driverName || '',
      driverDocument: initialData?.driverDocument || '',
      transportCompany: initialData?.transportCompany || '',
      supplierName: initialData?.supplierName || '',
      supplierDocument: initialData?.supplierDocument || '',
      expeditionResponsible: initialData?.expeditionResponsible || '',
      responsiblePosition: initialData?.responsiblePosition || '',
      products: initialData?.products || [],
      qualityControl: {
        responsibleName: initialData?.qualityControl?.responsibleName || '',
        approvalStatus: initialData?.qualityControl?.approvalStatus || 'pendente',
        justification: initialData?.qualityControl?.justification || '',
        digitalSignature: initialData?.qualityControl?.digitalSignature || '',
        observations: initialData?.qualityControl?.observations || '',
      },
      status: initialData?.status || 'pendente',
      dateTime: initialData?.dateTime ? formatDateForInput(initialData.dateTime) : formatDateForInput(new Date().toISOString()),
      arrivalDateTime: initialData?.arrivalDateTime ? formatDateTimeForForm(initialData.arrivalDateTime) : '',
    },
  });

  useEffect(() => {
    if (initialData) {
      const driver = drivers.find(d => d.name === initialData.driverName);
      const transport = transportCompanies.find(tc => tc.name === initialData.transportCompany);
      const supplier = suppliers.find(s => s.name === initialData.supplierName);
      const responsible = expeditionResponsibles.find(er => er.name === initialData.expeditionResponsible);
      const qualityResponsible = qualityResponsibles.find(qr => qr.name === initialData.qualityControl.responsibleName);

      form.reset({
        expeditionNumber: initialData.expeditionNumber,
        truckPlate: initialData.truckPlate,
        driverName: driver?.id || '',
        driverDocument: initialData.driverDocument,
        transportCompany: transport?.id || '',
        supplierName: supplier?.id || '',
        supplierDocument: initialData.supplierDocument,
        expeditionResponsible: responsible?.id || '',
        responsiblePosition: initialData.responsiblePosition || '',
        products: initialData.products,
        qualityControl: {
          responsibleName: qualityResponsible?.id || '',
          approvalStatus: initialData.qualityControl.approvalStatus || 'pendente',
          justification: initialData.qualityControl.justification || '',
          digitalSignature: initialData.qualityControl.digitalSignature || '',
          observations: initialData.qualityControl.observations || '',
        },
        status: initialData.status || 'pendente',
        dateTime: initialData.dateTime ? formatDateForInput(initialData.dateTime) : formatDateForInput(new Date().toISOString()),
        arrivalDateTime: initialData.arrivalDateTime ? formatDateTimeForForm(initialData.arrivalDateTime) : '',
      });
      setProducts(initialData.products || []);
    }
  }, [initialData, form, drivers, transportCompanies, suppliers, expeditionResponsibles, qualityResponsibles]);

  const onSubmitForm = async (values: z.infer<typeof formSchema>) => {
    // Converte a data e hora de chegada para ISO string para o backend
    const arrivalDateTimeISO = values.arrivalDateTime ? new Date(values.arrivalDateTime).toISOString() : undefined;

    // Encontrar os nomes correspondentes aos IDs selecionados
    const selectedDriver = drivers.find(d => d.id === values.driverName);
    const selectedTransportCompany = transportCompanies.find(tc => tc.id === values.transportCompany);
    const selectedSupplier = suppliers.find(s => s.id === values.supplierName);
    const selectedExpeditionResponsible = expeditionResponsibles.find(er => er.id === values.expeditionResponsible);
    const selectedQualityResponsible = qualityResponsibles.find(qr => qr.id === values.qualityControl.responsibleName);

    const dataToSend = {
      ...values,
      driverName: selectedDriver?.name || '',
      transportCompany: selectedTransportCompany?.name,
      supplierName: selectedSupplier?.name || '',
      expeditionResponsible: selectedExpeditionResponsible?.name || '',
      qualityControl: {
        ...values.qualityControl,
        responsibleName: selectedQualityResponsible?.name || '',
      },
      products: form.getValues('products'),
      arrivalDateTime: arrivalDateTimeISO,
    };

    if (initialData) {
      console.log('Submitting data from ExpeditionForm:', dataToSend);
      await onSubmit(dataToSend);
    } else {
      console.log('Tentando criar expedição...');
      try {
        const expeditionData: CreateExpeditionDTO = {
          expeditionNumber: dataToSend.expeditionNumber,
          truckPlate: dataToSend.truckPlate,
          driverName: dataToSend.driverName,
          driverDocument: dataToSend.driverDocument,
          transportCompany: dataToSend.transportCompany,
          supplierName: dataToSend.supplierName,
          supplierDocument: dataToSend.supplierDocument,
          expeditionResponsible: dataToSend.expeditionResponsible,
          responsiblePosition: dataToSend.responsiblePosition,
          products: dataToSend.products,
          status: dataToSend.status,
          qualityControl: {
            responsibleName: dataToSend.qualityControl.responsibleName,
            approvalStatus: dataToSend.qualityControl.approvalStatus,
            justification: dataToSend.qualityControl.justification,
            digitalSignature: dataToSend.qualityControl.digitalSignature,
            observations: dataToSend.qualityControl.observations,
            analysisDateTime: undefined,
          },
          rejection: undefined,
          dateTime: new Date().toISOString(),
          arrivalDateTime: arrivalDateTimeISO,
          createdBy: undefined,
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

        toast({
          title: "Sucesso",
          description: "Expedição cadastrada com sucesso!",
        });
        // Redireciona para a lista de expedições após o sucesso
        navigate('/?tab=list');
      } catch (error: any) {
        console.error("Erro ao criar expedição:", error);
      }
    }
  };

  const handleAddProduct = (product: Product) => {
    console.log('handleAddProduct: received product', product);
    console.log('handleAddProduct: productToEdit', productToEdit);
    let updatedProducts;
    if (productToEdit) {
      updatedProducts = products.map((p) => {
        if (p.id === product.id) {
          console.log('handleAddProduct: found matching product for update', product);
          return product; // Replace with the updated product
        }
        return p;
      });
    } else {
      updatedProducts = [...products, { ...product, id: Date.now().toString() }];
      console.log('handleAddProduct: added new product', updatedProducts);
    }
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
    setProductToEdit(undefined);
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    console.log('Attempting to edit product:', product);
    setProductToEdit(product);
    setIsProductDialogOpen(true);
    console.log('isProductDialogOpen after set:', true);
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
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
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
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsProductDialogOpen(true)}
            className="mb-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Produto na Expedição
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsNewProductDialogOpen(true)}
            className="mb-4 ml-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Produto (Catálogo)
          </Button>
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />

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
                    <FormLabel>Status de Aprovação (Controle de Qualidade)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
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

      <Card>
        <CardHeader>
          <CardTitle>Status da Expedição</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status da expedição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    <SelectItem value="retido">Retido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data/Hora de Chegada do Caminhão</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="arrivalDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data/Hora de Chegada do Caminhão</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => navigate('/?tab=list')}>
          Voltar para a Lista
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar Expedição' : 'Criar Expedição'}
        </Button>
      </div>
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
          setQualityResponsibles((prev) => [...prev, newQualityResponsible]);
        }}
      />

      <NewProductDialog
        isOpen={isNewProductDialogOpen}
        onClose={() => setIsNewProductDialogOpen(false)}
        onSuccess={(newProduct) => {
          setProductCatalog((prev) => [...prev, newProduct]);
        }}
      />
    </Form>
  );
}

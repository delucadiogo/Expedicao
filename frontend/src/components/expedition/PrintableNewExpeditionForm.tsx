import React from 'react';

interface PrintableNewExpeditionFormProps {
  onClose: () => void;
}

const PrintableNewExpeditionForm: React.FC<PrintableNewExpeditionFormProps> = ({ onClose }) => {
  return (
    <div className="print-only" style={{
      width: '21cm',
      minHeight: '29.7cm',
      padding: '1cm',
      margin: '0 auto',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10pt',
      lineHeight: '1.4',
    }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-only, .print-only * {
              visibility: visible;
            }
            .print-only {
              position: absolute;
              left: 0;
              top: 0;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>

      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '16pt', margin: '0', fontWeight: 'bold' }}>FICHA DE EXPEDIÇÃO</h1>
        <p style={{ fontSize: '10pt', margin: '5px 0' }}>Documento para Preenchimento Manual</p>
      </div>

      {/* Informações Básicas */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ flex: '1', marginRight: '20px' }}>
            <strong>Nº Expedição:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
          <div style={{ flex: '1' }}>
            <strong>Data/Hora:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
        </div>
      </div>

      {/* Transporte */}
      <div style={{ marginBottom: '15px' }}>
        <h2 style={{ fontSize: '12pt', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>
          DADOS DO TRANSPORTE
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong>Placa do Veículo:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
          <div>
            <strong>Motorista:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
          <div>
            <strong>Documento:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
          <div>
            <strong>Empresa Transportadora:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
        </div>
      </div>

      {/* Fornecedor */}
      <div style={{ marginBottom: '15px' }}>
        <h2 style={{ fontSize: '12pt', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>
          DADOS DO FORNECEDOR
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong>Nome/Razão Social:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
          <div>
            <strong>CNPJ/CPF:</strong>
            <div style={{ borderBottom: '1px solid #000', height: '20px', marginTop: '5px' }}></div>
          </div>
        </div>
      </div>

      {/* Produtos */}
      <div style={{ marginBottom: '15px' }}>
        <h2 style={{ fontSize: '12pt', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>
          PRODUTOS
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #000', padding: '5px' }}>Item</th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>Código</th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>Descrição</th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>Qtd</th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>Lote</th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>Validade</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assinaturas */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ borderBottom: '1px solid #000', height: '50px', marginBottom: '5px' }}></div>
            <p style={{ textAlign: 'center', margin: '0' }}>Responsável pela Expedição</p>
          </div>
          <div>
            <div style={{ borderBottom: '1px solid #000', height: '50px', marginBottom: '5px' }}></div>
            <p style={{ textAlign: 'center', margin: '0' }}>Motorista</p>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '12pt', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>
          OBSERVAÇÕES
        </h2>
        <div style={{ border: '1px solid #000', height: '100px', padding: '5px' }}></div>
      </div>
    </div>
  );
};

export default PrintableNewExpeditionForm; 
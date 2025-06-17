/**
 * Utilitário de log condicional para o frontend.
 * Só exibe logs no console em ambiente de desenvolvimento.
 */
const isDevelopment = import.meta.env.MODE === 'development';

export const log = {
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    // Erros devem ser sempre logados, mesmo em produção, mas talvez enviados para um serviço de monitoramento
    // Por enquanto, vamos manter no console para desenvolvimento e pensar em um serviço para produção.
    console.error('[ERROR]', ...args);
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },
}; 
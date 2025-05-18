import { z } from 'zod'

const schemaCustomers = z.object({

  nome: z.string().nonempty('O nome é obrigatório.'),
  cnpj: z.string().min(14, 'CNPJ deve ter pelo menos 14 números.').regex(/^\d{14}$/, 'CNPJ deve conter apenas números e ter 14 dígitos.'),
  endereco: z.string().nonempty('O endereço é obrigatório.') 

 })

 export default schemaCustomers
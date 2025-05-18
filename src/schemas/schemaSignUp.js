import { z } from 'zod'

const schemaSignUp = z.object({

  nome: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  email: z.string().nonempty('E-mail é obrigatório').email('Formato de e-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
})

export default schemaSignUp
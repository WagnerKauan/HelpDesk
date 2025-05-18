import { z } from 'zod'

const schemaSignIn = z.object({

  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres.')
})

export default schemaSignIn
declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    cpf(): Rule
    phone(): Rule
    emailUnique(): Rule
  }
}

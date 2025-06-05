// Exemplo do que o backend deveria implementar para o endpoint /me

/**
 * Endpoint: GET /api/v1/users/me
 *
 * Descrição: Retorna os dados do usuário autenticado
 *
 * Headers necessários:
 * - Authorization: Bearer {token}
 *
 * Resposta de sucesso (200 OK):
 * {
 *   "id": 3,
 *   "username": "dathannobrega",
 *   "email": "dathanitau@gmail.com",
 *   "first_name": "Dathan",
 *   "last_name": "Nobrega",
 *   "role": "platform_admin",
 *   "company": "",
 *   "job_title": "",
 *   "profile_image": "https://lh3.googleusercontent.com/a/ACg8ocJr5tFd5sDRLo4RYSn4ZUwxhLgvuhjWZ0j0d5r2Jz0XYdSL6GEaHw=s96-c",
 *   "organization": null,
 *   "contact": null,
 *   "is_subscribed": true
 * }
 *
 * Resposta de erro (401 Unauthorized):
 * {
 *   "detail": "Token inválido ou expirado"
 * }
 *
 * Implementação em FastAPI:
 *
 * @router.get("/me", response_model=UserOut)
 * def read_current_user(current_user: User = Depends(get_current_user)):
 *     return current_user
 *
 * Onde get_current_user é uma dependência que:
 * 1. Extrai o token do header Authorization
 * 2. Verifica se o token é válido
 * 3. Busca o usuário no banco de dados
 * 4. Retorna o usuário ou lança uma exceção HTTPException(401)
 */

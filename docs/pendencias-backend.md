# Pendências para os times de Java e .NET

Resultado da revisão do app contra os backends (Java `e6a0051`, .NET sprint4 `a54697b`), testado ao vivo no Render.
O app não precisa esperar por nada disto para funcionar; são correções e um recurso novo.

## 1. Veterinário: especialidade e espécies atendidas (recurso novo, só Java)

Hoje `TAB_VETERINARIO` guarda apenas usuário, CRMV e status. Não existe como o veterinário informar **com quais
animais trabalha** nem **a área de atuação**, então o app não tem o que mostrar nem enviar.

**Banco**

```sql
ALTER TABLE TAB_VETERINARIO ADD (DS_ESPECIALIDADE_VETERINARIO VARCHAR2(60));

CREATE TABLE TAB_VETERINARIO_ESPECIE (
    ID_VETERINARIO NUMBER NOT NULL,
    ID_ESPECIE     NUMBER NOT NULL,
    CONSTRAINT PK_TAB_VETERINARIO_ESPECIE PRIMARY KEY (ID_VETERINARIO, ID_ESPECIE),
    CONSTRAINT FK_VET_ESPECIE_VET     FOREIGN KEY (ID_VETERINARIO) REFERENCES TAB_VETERINARIO (ID_VETERINARIO),
    CONSTRAINT FK_VET_ESPECIE_ESPECIE FOREIGN KEY (ID_ESPECIE)     REFERENCES TAB_ESPECIE (ID_ESPECIE)
);
```

**Endpoints (Java)**

| Método e rota | O que faz |
|---|---|
| `PUT /api/veterinarios/me/atuacao` | Corpo `{ "especialidade": "Dermatologia", "idsEspecies": [1, 2] }`. Só `ROLE_VETERINARIO`. |
| `GET /api/usuarios/me` (já existe) | Passa a devolver `especialidade` e `especies` no `VetResponse`. |
| `GET /api/veterinarios` e `/{id}` (já existem) | `VeterinarioPublicoResponse` ganha `especialidade` e `especies`; a busca ganha os filtros `especialidade` e `idEspecie`. |

Sugestão de lista de áreas (texto controlado, para o filtro funcionar): Clínica geral, Cirurgia, Dermatologia,
Cardiologia, Ortopedia, Oncologia, Oftalmologia, Animais silvestres e exóticos, Grandes animais.

Quando isso existir, o app ganha: seleção de espécies e área no cadastro/edição do veterinário, exibição no perfil e
filtro na busca feita pelo tutor ao compartilhar um pet.

## 2. Integração com o Gemini (.NET)

Arquivos: `Infrastructure/Services/GeminiService.cs`, `Application/UseCases/PlanoCuidadosUseCase.cs`.

1. **Erro devolvido como se fosse o plano.** Hoje, se o Gemini falha, o código faz
   `return $"Erro {response.StatusCode} do Gemini: {erroDetalhado}"` e a API responde **200**.
   O app já se defende disso, mas o correto é um erro de verdade:

   ```csharp
   if (!response.IsSuccessStatusCode)
       throw new GeminiUnavailableException((int)response.StatusCode);   // controller -> 502 / 503
   ```

2. **Chave na URL.** `?key=` aparece em logs (o HttpClient registra a URL em nível Information e o Serilog está em
   Information) e na telemetria. Enviar no cabeçalho:

   ```csharp
   var request = new HttpRequestMessage(HttpMethod.Post, _apiUrl) { Content = content };
   request.Headers.Add("x-goog-api-key", _apiKey);
   ```

   Depois, **trocar a chave** (a antiga continua no histórico do git do repositório antigo).

3. **Sem tratamento de falhas.** Não há `try/catch`, timeout nem retry. Resposta sem `candidates` (bloqueio de
   segurança) gera 500. Tratar `HttpRequestException`, `TaskCanceledException` e `KeyNotFoundException`/
   `IndexOutOfRangeException` do `GetProperty("candidates")[0]`, e configurar `HttpClient.Timeout` (ex.: 30 s).

4. **Prompt confuso.** O `GeminiService` monta "medicamentos em uso: {contexto inteiro}" e o `PlanoCuidadosUseCase`
   envia **todos** os medicamentos (inclusive concluídos). Há duas instruções concorrentes ("breve plano com 3 dicas"
   e "orientações preventivas") e o texto sai longo (~3.000 caracteres). Usar `systemInstruction`, enviar só
   medicamentos `EM_USO`, incluir vacinas, consultas, exames, peso e idade, e pedir formato e tamanho
   (ex.: "no máximo 12 linhas, texto simples").

5. **Custo e abuso.** `GET /plano-cuidados` chama a IA a cada requisição, sem cache nem limite. Cachear por pet por
   alguns minutos e/ou aplicar rate limit por usuário (`AddRateLimiter`).

6. **Sobras e testes.** Remover `Application/UseCases/GeminiUseCase.cs` (sem uso) e adicionar testes do
   `PlanoCuidadosUseCase` com `IGeminiService` simulado. Configurar `Gemini__ApiKey` no workflow do Azure.
   Atualizar o README (ele diz que o Gemini "não foi validado"; ele funciona no Render).

## 3. Segurança

- **Java:** `GET/PUT/DELETE /api/users/{id}` não confere o dono — qualquer usuário logado lê, altera e apaga outro.
  Remover o `UserController` ou conferir que `{id}` é o do token. O app usa só `/api/usuarios/me`.
- **Java e .NET:** segredos (`app.jwt.secret`, senha do banco) já estiveram escritos em arquivos versionados.
  Usar só variáveis de ambiente e **trocar** o segredo do JWT e a senha do banco.
- **.NET:** `appsettings.json` voltou a conter a connection string do Oracle e o segredo do JWT (commit `a8a89ea`).
- **.NET:** CORS com `AllowAnyOrigin` e `UseCors` chamado duas vezes.

## 4. Outros pontos

- **MongoDB em produção:** `GET /api/pets/{id}/pesos/mongo` responde 500 e `/health/ready` responde 503, pois a
  string de conexão aponta para `localhost`. Configurar `ConnectionStrings__Mongodb` no Render.
- **`vacinasAtrasadas` (Java, `RelatorioService`):** conta qualquer aplicação com `proximaDose < hoje`, mesmo que
  uma dose mais nova já tenha sido aplicada da mesma vacina. Considerar só a aplicação mais recente de cada vacina.
- **Excluir conta:** `DELETE /api/usuarios/me` apenas desativa o usuário (o app usa este). `DELETE /api/users/{id}`
  falha com 500 quando há pets (chave estrangeira); se for mantido, devolver 409 com mensagem.
- **Token:** dura 1 hora e não há refresh; o app volta ao login quando ele vence.

# AmandaBa — app mobile (Tutor e Veterinário)

Aplicativo mobile (React Native + Expo SDK 57, TypeScript) para tutores acompanharem a saúde dos seus pets:
cadastro de pets, peso, vacinas, histórico clínico (doenças, alergias, medicamentos), exames, plano de
cuidados gerado por IA e **lembretes por notificação local** de vacinas e medicamentos.

Todas as telas consomem as APIs reais do projeto (sem dados simulados):

| API | Responsabilidade | URL |
| --- | --- | --- |
| Java (Spring) | Cadastro, login (emite o JWT) e perfil do usuário | `https://fiap-amandaba-java.onrender.com` |
| .NET | Pets, vacinas, histórico clínico, exames, plano de cuidados (valida o JWT do Java) | `https://fiap-amandaba-dotnet.onrender.com` |

### Autenticação (JWT)

O login (`POST /api/auth/login`) devolve um JWT (validade de 1 hora) e o id do tutor (`idPerfil`). O app
guarda a sessão, envia `Authorization: Bearer <token>` em todas as chamadas às duas APIs
(`services/http.ts`) e usa:

- cadastro: `POST /api/auth/register/tutor` (tutor) e `POST /api/auth/register/vet` (veterinário, com CRMV)
- perfil: `GET`/`PUT`/`DELETE /api/usuarios/me`, `PUT /api/usuarios/me/senha` (sempre o usuário do token; `DELETE` desativa a conta) e, para veterinário, `PUT /api/veterinarios/me/crmv`
- veterinários: `GET /api/veterinarios?nome=` (busca) e, no .NET, `/api/pets/{id}/veterinarios` (compartilhar/revogar) `/api/veterinarios/me/pets` (pacientes, com busca por nome **ou CRMV** no compartilhamento) e `/api/relatorios/*/me` (indicadores)
- pets: `/api/tutores/{idTutor}/pets` e `/api/pets/{id}/...`

Quando a API recusa o token (expirado ou revogado, HTTP 401), a sessão é encerrada e o app volta ao
login com um aviso. O perfil vem do próprio login: tutor e veterinário entram em áreas diferentes do app.
O token fica no armazenamento local do app (AsyncStorage).

> As duas APIs rodam no plano gratuito do Render: a primeira chamada após um período parado pode levar
> alguns dezenas de segundos (cold start).

## Equipe

<!-- Preencher: nome e RM de cada integrante -->

## Como rodar

```bash
npm install
npx expo start          # abre o menu do Expo (Expo Go / emulador)
npx expo start --web    # versão web, útil para conferir telas (notificações não funcionam na web)
npx tsc --noEmit        # checagem de tipos
```

## Arquitetura

O código é separado em camadas; cada camada só conhece a de baixo:

```
src/
├── interfaces/   Tipos TypeScript (contratos das APIs, navegação, lembretes)
├── services/     Acesso a dados e a recursos do dispositivo: HTTP, AsyncStorage, notificações
├── domain/       Regras de negócio puras (sem React, sem rede): validação e montagem dos
│                 dados enviados à API, agregação da Home, planejamento dos lembretes
├── hooks/        TanStack Query (useQuery/useMutation) e orquestração; é a única ponte entre
│                 as telas e os serviços
├── providers/    QueryProvider (cache) e AuthProvider (sessão)
├── theme/        Paletas clara/escura, ThemeProvider e fábricas de estilo
├── navigation/   Navegadores (Root > Tabs > Stacks) e navegação por notificação
├── components/   Componentes de UI reutilizáveis, sem regra de negócio
├── screens/      Telas: apenas UI + chamadas a hooks
├── styles/       Fábricas de estilo `create*Styles(palette)` por tela
└── utils/        Formatação e datas
```

Regras seguidas:

- **Nenhuma tela faz requisição HTTP nem aplica regra de negócio.** Telas chamam hooks
  (`usePets`, `useCreateMedicamento`, `useLogin`…); os hooks chamam `services/`; a validação dos
  formulários vive em `domain/recordInputs.ts` e `domain/authInputs.ts`.
- **Estado de servidor com TanStack Query**, com chaves hierárquicas (`['pet', id, 'vacinas']`):
  ao cadastrar algo, a invalidação atualiza automaticamente Home, listas, detalhe e lembretes.
- **Erros de API** viram mensagens amigáveis em `services/http.ts` (`ApiError`, `getErrorMessage`).
- **Navegação imperativa** (`navigation.reset`/`navigate`) com `initialRouteName` conforme a sessão
  restaurada — sem telas condicionais.

## Tema claro/escuro

`ThemeProvider` expõe uma paleta semântica (`background`, `surface`, `text`, `green`…). O modo é
**Automático** (segue o sistema), **Claro** ou **Escuro**, escolhido em *Perfil › Aparência* e
persistido. Os estilos são fábricas `create*Styles(palette)` memoizadas por `useThemedStyles`, então
nenhum componente usa cor fixa. O `NavigationContainer` e a `StatusBar` também acompanham o tema.

## Notificações locais

Implementadas com `expo-notifications` (`services/notificationService.ts`), sem servidor:

- **Vacinas:** lembrete na véspera e no dia da *próxima dose* (09:00).
- **Medicamentos em uso:** lembretes nos horários informados no campo *Horários dos lembretes*
  (ex.: `08:00, 20:00`), respeitando data de início/término, numa janela móvel de 7 dias.
- **Consultas agendadas:** lembrete na véspera às 9h e, no dia, 1 hora antes do horário (às 8h se a consulta
  não tiver horário). Consultas realizadas ou canceladas não geram lembrete.
- Os lembretes são **recalculados a partir dos dados reais da API** sempre que algo muda
  (`useReminderSync`): cadastrar uma vacina ou um medicamento reagenda tudo (limite de 60 agendados).
- **Toque na notificação** abre o *Detalhe do pet* já na aba certa (Vacinas, Consultas ou Clínico), com o app
  aberto, em segundo plano ou fechado.
- O **sino na tela Início** (com o número de lembretes que ainda vão tocar hoje) abre a tela *Lembretes*: situação da
  permissão (com atalho para as configurações do sistema se negada), os **próximos** lembretes e os **enviados
  recentemente**. Tocar em um lembrete abre o pet.
- O sistema não informa o que já foi entregue, então o app guarda a lista agendada e, a cada sincronização,
  move para o histórico (até 50) o que já passou da hora (`domain/reminderLog.ts`). O histórico só é
  registrado com as notificações ativadas e é apagado ao sair da conta.

As regras de quando lembrar ficam em `domain/reminders.ts` (função pura, testável).
Notificações não existem na versão web; teste em celular (Expo Go ou APK).

## Tela "Sobre o App" e hash do commit

*Perfil › Sobre o app* mostra o nome e a versão. O **hash do commit** continua sendo gravado em cada build por
`app.config.js` (`git rev-parse HEAD`; no EAS usa `EAS_BUILD_GIT_COMMIT_HASH`) e lido por
`services/appInfoService.ts` (`getAppInfo().commitHash`), mas **não é exibido na tela**. Para voltar a exibi-lo basta
mostrar `info.commitShort` e `info.commitHash` na `SobreScreen`.

> Para a entrega: **faça commit de tudo antes de gerar o build**, para o hash gravado corresponder ao código final.

## Ajuda dentro do app

Explicações de funcionalidades ficam atrás de um botão **"i"** (`components/InfoHint.tsx`), que abre uma janela
curta: no cabeçalho das telas (`ScreenHeader` aceita a propriedade `info`) ou ao lado de uma seção.

## Gerar o APK e distribuir (Firebase App Distribution)

1. Instale e entre no EAS: `npm i -g eas-cli` e `eas login`.
2. Na primeira vez: `eas build:configure` (o `eas.json` do repositório já traz os perfis).
3. Gere o APK: `eas build --platform android --profile preview`. Baixe o `.apk` ao final.
4. No [Firebase Console](https://console.firebase.google.com): crie o projeto, adicione um app Android com
   o pacote `br.com.fiap.amandaba` e abra **App Distribution**.
5. Envie o APK, crie um grupo de testadores e adicione o **e-mail institucional do professor**.
6. Abra o app instalado, vá em *Perfil › Sobre o app* e confira que o hash é o do último commit.

## Funcionalidades (Sprint 3 mantidas + Sprint 4)

- Cadastro como **tutor** ou **veterinário** (CRMV), login e sessão persistente (reabrir o app não pede login de novo)
- Início: pets ativos, próximas doses, ciclos atrasados, ciclo da semana
- Pets: listar, cadastrar, editar (com confirmação), inativar/reativar, excluir (marca como inativo)
- Detalhe do pet: resumo, peso (histórico), vacinas, **consultas** (agendar/registrar, marcar como realizada ou
  cancelar), clínico (doenças, alergias, medicamentos), exames, e a idade do pet no cabeçalho
- **Registros de saúde completos:** todo registro (peso, vacina, consulta, doença, alergia, medicamento e exame)
  pode ser **editado e excluído**; medicamentos (em uso, concluído, suspenso) e exames (solicitado, realizado,
  resultado disponível) têm **troca de status** — concluir um medicamento encerra os lembretes dele
- **Saúde dos pets:** a Home do tutor e a lista de pacientes do veterinário mostram os indicadores do relatório
  (idade, doenças ativas, medicamentos em uso, vacinas atrasadas, consultas)
- Pets: busca por nome e lista paginada (`GET /api/pets/me`)
- Cuidados: o plano gerado por IA é exibido formatado (títulos, listas), fica salvo por pet no aparelho
  (com data de geração e botão para gerar um novo) e erros do serviço de IA viram mensagens claras
- Cuidados: plano de cuidados gerado por IA a partir do histórico clínico
- Perfil: dados do tutor, editar perfil (nome, telefone e nascimento — CPF e e-mail travados, com
  confirmação), tema, lembretes, sobre o app, sair e excluir conta (com confirmação; a conta é
  desativada e o login deixa de funcionar), **alterar senha**
- **Veterinário:** aba *Pacientes* (pets que os tutores compartilharam), detalhe do pet (consulta e registro de
  peso, vacinas, clínico e exames — sem editar o cadastro do pet) e *Perfil* (inclui CRMV)
- **Tutor ↔ veterinário:** no detalhe do pet, aba *Veterinários* para buscar um veterinário pelo nome,
  compartilhar o pet e revogar o acesso
- **Sprint 4:** tema claro/escuro, notificações locais, arquitetura em camadas com TanStack Query,
  tela Sobre com hash do commit

## Vídeo de demonstração

<!-- Colar aqui o link do vídeo -->

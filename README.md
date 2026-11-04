# AmandaBa — app mobile (Tutor e Veterinário)

Entrega final (Sprint 4) da disciplina **Mobile Application Development** — FIAP, Challenge 2026.

## Problema e solução

Tutores esquecem vacinas, horários de medicamentos e consultas, e não têm o histórico de saúde do pet à mão
quando vão ao veterinário. Veterinários, por sua vez, recebem informações soltas e incompletas.

O **AmandaBa** reúne tudo em um único app (React Native + Expo SDK 57, TypeScript):

- o **tutor** cadastra seus pets e acompanha peso, vacinas, consultas, doenças, alergias, medicamentos e exames,
  recebe **lembretes por notificação local** e um **plano de cuidados gerado por IA**;
- o **veterinário** vê os pets que os tutores compartilharam com ele (pacientes), consulta o histórico e
  registra consultas, pesos, vacinas e exames.

Todas as telas consomem as APIs reais do projeto — não há dados simulados.

## Equipe

| Nome | RM |
| --- | --- |
| _preencher_ | _preencher_ |

## Links da entrega

| Item | Link |
| --- | --- |
| Repositório (GitHub Classroom) | https://github.com/FIAP-AMANDABA/fiap-amandaba-mobile |
| Aplicativo no Firebase App Distribution | _colar o link de convite/instalação_ |
| Vídeo de apresentação (YouTube) | _colar o link do vídeo_ |
| API Java (login, cadastro, perfil) | https://fiap-amandaba-java.onrender.com |
| API .NET (pets, saúde, plano de cuidados) | https://fiap-amandaba-dotnet.onrender.com |

> As duas APIs rodam no plano gratuito do Render: a primeira chamada depois de um período parado pode levar
> algumas dezenas de segundos (cold start). O app tem indicadores de carregamento e avisos de erro nesses casos.

## Tecnologias

- React Native 0.86 + **Expo SDK 57**, TypeScript (modo estrito)
- **React Navigation 7** (stack nativo + abas) com rotas declaradas explicitamente
- **TanStack Query 5** (`useQuery`, `useInfiniteQuery`, `useMutation`) para todo acesso às APIs
- **expo-notifications** (notificações locais)
- AsyncStorage (sessão, histórico de lembretes e planos de cuidados salvos)
- Autenticação **JWT** (API Java) validada também pela API .NET
- EAS Build (APK) e **Firebase App Distribution** (distribuição)

## Requisitos da Sprint 4 — onde cada um está no app

| Requisito | Como foi atendido |
| --- | --- |
| **Todas as telas funcionais** (20 pts) | Todas as telas das Sprints 1–3 foram mantidas e integradas às APIs; cadastro, listagem, edição e exclusão reais. Veja [Telas do app](#telas-do-app). |
| **Publicação** (20 pts) | APK distribuído pelo Firebase App Distribution com o e-mail do professor como testador. Tela **Perfil › Sobre o app** mostra o **hash do commit**. Veja [Publicação](#publicação-firebase-app-distribution). |
| **Notificações** (20 pts) | Notificações **locais** de vacinas, medicamentos e consultas, geradas a partir dos dados reais da API; o toque abre o pet. Veja [Notificações locais](#notificações-locais). |
| **Arquitetura e organização** (20 pts) | Camadas `interfaces → services → domain → hooks → components/screens`; TanStack Query só em `hooks/`; telas sem HTTP nem regra de negócio. Veja [Arquitetura](#arquitetura). |
| **Vídeo de demonstração** (20 pts) | Link acima. Mostra o fluxo completo, a notificação disparando e a tela Sobre com o hash. |
| **Tema claro/escuro** | Modo Automático / Claro / Escuro em **Perfil › Aparência**. Veja [Tema claro/escuro](#tema-claroescuro). |

## Telas do app

**Acesso:** Boas-vindas, Login, Cadastro (tutor ou veterinário, com CRMV).

**Tutor** (abas Início · Pets · Cuidados · Perfil):

| Tela | O que faz |
| --- | --- |
| Início | Pets ativos, próximas doses, ciclos atrasados, ciclo da semana, indicadores de saúde e **sino de lembretes** |
| Lembretes | Permissão de notificação, próximos lembretes e enviados recentemente |
| Lista de pets | Busca por nome, lista paginada, atalhos para cadastrar e editar |
| Cadastro/edição de pet | Formulário com validação e confirmação antes de salvar |
| Detalhe do pet | Abas Resumo, Peso, Vacinas, Consultas, Clínico (doenças, alergias, medicamentos), Exames e Veterinários |
| Cuidados | Escolha do pet e **plano de cuidados gerado por IA** (formatado, salvo por pet) |
| Perfil | Dados da conta, aparência, lembretes, sobre o app, sair e excluir conta |
| Editar perfil / Alterar senha | Atualização real da conta pela API |
| Sobre o app | Nome, versão e **hash do commit** |

**Veterinário** (abas Pacientes · Perfil): lista de pacientes (pets compartilhados pelos tutores, com indicadores
de saúde), detalhe do paciente (consultas, peso, vacinas, clínico e exames) e perfil com CRMV.

Resumo das funcionalidades:

- **CRUD completo** de pets e de todos os registros de saúde (peso, vacina, consulta, doença, alergia,
  medicamento, exame); medicamentos e exames têm **troca de status**
- **Consultas:** agendar ou registrar, marcar como realizada ou cancelar
- **Tutor ↔ veterinário:** buscar veterinário por nome ou CRMV, compartilhar o pet e revogar o acesso
- **Saúde dos pets:** idade, doenças ativas, medicamentos em uso, vacinas atrasadas e consultas (relatório da API)
- **Plano de cuidados por IA:** erros do serviço de IA viram mensagens claras
- Sessão persistente: reabrir o app não pede login de novo; token expirado leva ao login com um aviso
- Ajuda em cada tela atrás do botão **"i"**

## APIs e autenticação (JWT)

| API | Responsabilidade |
| --- | --- |
| Java (Spring) | Cadastro, login (emite o JWT) e perfil do usuário |
| .NET | Pets, vacinas, histórico clínico, exames, consultas, compartilhamento, relatórios e plano de cuidados (valida o JWT do Java) |

O login (`POST /api/auth/login`) devolve um JWT (validade de 1 hora) e o id do perfil. O app guarda a sessão,
envia `Authorization: Bearer <token>` em todas as chamadas (`services/http.ts`) e usa:

- cadastro: `POST /api/auth/register/tutor` e `POST /api/auth/register/vet` (com CRMV)
- perfil: `GET`/`PUT`/`DELETE /api/usuarios/me`, `PUT /api/usuarios/me/senha` (`DELETE` desativa a conta) e, para
  veterinário, `PUT /api/veterinarios/me/crmv`
- veterinários: `GET /api/veterinarios?nome=` e `?crmv=` (busca)
- pets e registros: `/api/tutores/{idTutor}/pets`, `GET /api/pets/me` (paginado) e `/api/pets/{id}/...`
  (pesos, vacinas, doenças, alergias, medicamentos, exames, consultas, veterinários, plano de cuidados, idade)
- veterinário: `/api/veterinarios/me/pets` (pacientes) e `/api/relatorios/{tutor|veterinario}/me` (indicadores)

Quando a API recusa o token (HTTP 401), a sessão é encerrada e o app volta ao login. Tutor e veterinário entram
em áreas diferentes, conforme o perfil devolvido pelo login.

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

- **Nenhuma tela faz requisição HTTP nem aplica regra de negócio.** Telas chamam hooks (`usePets`,
  `useCreateMedicamento`, `useLogin`…); os hooks chamam `services/`; a validação dos formulários vive em
  `domain/recordInputs.ts` e `domain/authInputs.ts`.
- **Estado de servidor com TanStack Query**, com chaves hierárquicas (`['pet', id, 'vacinas']`): ao cadastrar
  ou alterar algo, a invalidação atualiza Home, listas, detalhe e lembretes sem recarregar o app.
- **Sem duplicação:** formulários e diálogos repetidos foram extraídos em hooks e componentes
  (`useRecordForm`, `useRecordDialogs`, `FormFooter`, `RecordActions`, `DeleteRecordModal`…).
- **Erros de API** viram mensagens amigáveis em `services/http.ts` (`ApiError`, `getErrorMessage`).
- **Navegação por rotas reais** (React Navigation), com a rota inicial definida pela sessão restaurada.

## Tema claro/escuro

`ThemeProvider` expõe uma paleta semântica (`background`, `surface`, `text`, `green`…). O modo é **Automático**
(segue o sistema), **Claro** ou **Escuro**, escolhido em *Perfil › Aparência* e persistido. Os estilos são
fábricas `create*Styles(palette)` memoizadas por `useThemedStyles`, então nenhum componente usa cor fixa. O
`NavigationContainer` e a `StatusBar` também acompanham o tema.

## Notificações locais

**Cenário:** lembrar o tutor, no momento certo, de algo que afeta a saúde do pet. Implementado com
`expo-notifications` (`services/notificationService.ts`), sem servidor:

- **Vacinas:** lembrete na véspera e no dia da *próxima dose* (09:00).
- **Medicamentos em uso:** lembretes nos horários informados no campo *Horários dos lembretes* (ex.: `08:00, 20:00`),
  respeitando data de início e término, numa janela móvel de 7 dias.
- **Consultas agendadas:** lembrete na véspera às 9h e, no dia, 1 hora antes do horário (às 8h se a consulta não
  tiver horário). Consultas realizadas ou canceladas não geram lembrete.

**Disparo:** os lembretes são recalculados a partir dos **dados reais da API** sempre que algo muda
(`useReminderSync`): cadastrar ou alterar uma vacina, medicamento ou consulta reagenda tudo (limite de 60
agendados). Concluir um medicamento encerra os lembretes dele.

**Recepção:** a notificação aparece com o app aberto, em segundo plano ou fechado. **Tocar nela abre o detalhe do
pet já na aba certa** (Vacinas, Consultas ou Clínico).

**Sino na tela Início:** mostra quantos lembretes ainda vão tocar hoje e abre a tela *Lembretes* (situação da
permissão, próximos lembretes e enviados recentemente). O sistema não informa o que já foi entregue; por isso o
app guarda a lista agendada e, a cada sincronização, move para o histórico o que já passou da hora
(`domain/reminderLog.ts`). O histórico é apagado ao sair da conta.

As regras de quando lembrar ficam em `domain/reminders.ts` (funções puras). Notificações não existem na versão
web; teste em celular (Expo Go ou APK).

**Como testar rápido:** cadastre um medicamento em uso com um horário daqui a alguns minutos (ou uma consulta
para daqui a 1 hora) e aguarde a notificação.

## Tela "Sobre o app" e hash do commit

*Perfil › Sobre o app* mostra nome, versão e o **hash do commit** (curto e completo) que gerou o build.
O hash é gravado em cada build por `app.config.js` (`git rev-parse HEAD`; no EAS usa `EAS_BUILD_GIT_COMMIT_HASH`) e
lido por `services/appInfoService.ts`. Assim a versão instalada pode ser conferida contra o código do repositório.

> **Faça commit de tudo antes de gerar o build**, para o hash gravado corresponder ao código final.

## Publicação (Firebase App Distribution)

1. Instale e entre no EAS: `npm i -g eas-cli` e `eas login`.
2. Gere o APK: `eas build --platform android --profile preview` (o `eas.json` do repositório já traz os perfis).
   Baixe o `.apk` ao final.
3. No [Firebase Console](https://console.firebase.google.com): crie o projeto, adicione um app Android com o pacote
   `br.com.fiap.amandaba` e abra **App Distribution**.
4. Envie o APK, crie um grupo de testadores e adicione o **e-mail institucional do professor**.
5. Abra o app instalado, vá em *Perfil › Sobre o app* e confira que o hash é o do último commit do repositório.

## Como rodar o projeto

Pré-requisitos: Node.js 20+ e, para testar no celular, o app **Expo Go** (ou um emulador Android/iOS).

```bash
npm install
npx expo start          # abre o menu do Expo (Expo Go / emulador)
npx expo start --web    # versão web, útil para conferir telas (notificações não funcionam na web)
npx tsc --noEmit        # checagem de tipos
```

As URLs das APIs já estão configuradas em `src/services/` e não exigem variáveis de ambiente.
Para entrar, cadastre-se como tutor ou veterinário na própria tela de cadastro.

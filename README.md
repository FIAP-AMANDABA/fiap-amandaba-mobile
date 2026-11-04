# AmandaBa

Aplicativo mobile para tutores e veterinários acompanharem a saúde dos pets.
Entrega final (Sprint 4) de Mobile Application Development, FIAP, Challenge 2026.

## Equipe

| Nome | RM |
| --- | --- |
| Diego Andrade | RM566385 |
| Grazielle Alencar | RM561529 |
| Julia Corrêa | RM564870 |
| Rafel Kubagawa | RM565572 |
| Vinicius Soteras | RM566230 |

## Links

| Item | Link |
| --- | --- |
| Repositório | https://github.com/FIAP-AMANDABA/fiap-amandaba-mobile |
| App no Firebase App Distribution | https://appdistribution.firebase.dev/i/81d8749130587b24 |
| API Java (login, cadastro, perfil) | https://fiap-amandaba-java.onrender.com |
| API .NET (pets, saúde, plano de cuidados) | https://fiap-amandaba-dotnet.onrender.com |

> As APIs estão no plano gratuito do Render. Se ficaram um tempo sem uso, o primeiro login ou cadastro pode levar cerca de 1 minuto para responder.

## O que o app faz

- **Tutor:** cadastra pets e acompanha peso, vacinas, consultas, doenças, alergias, medicamentos e exames. Recebe lembretes por notificação e um plano de cuidados gerado por IA.
- **Veterinário:** vê os pets que os tutores compartilharam com ele e registra consultas, pesos, vacinas e exames.

Todas as telas usam as APIs reais, sem dados simulados.

## Tecnologias

React Native + Expo SDK 57, TypeScript, React Navigation, TanStack Query, expo-notifications, AsyncStorage, autenticação JWT, EAS Build e Firebase App Distribution.

## Requisitos da Sprint 4

| Requisito | Como foi atendido |
| --- | --- |
| Todas as telas funcionais | Todas as telas integradas às APIs, com cadastro, listagem, edição e exclusão. |
| Publicação | APK distribuído pelo Firebase App Distribution. A tela **Perfil › Sobre o app** mostra o hash do commit. |
| Notificações | Notificações locais de vacinas, medicamentos e consultas, geradas a partir dos dados da API. Ao tocar, abre o pet. |
| Arquitetura e organização | Código em camadas, com acesso às APIs apenas nos hooks e nenhuma regra de negócio nas telas. |

## Notificações

Feitas com `expo-notifications`, de forma local (sem servidor):

- **Vacinas:** lembrete na véspera e no dia da próxima dose, às 09:00.
- **Medicamentos em uso:** lembrete nos horários informados no cadastro (ex.: `08:00, 20:00`).
- **Consultas agendadas:** lembrete na véspera às 09:00 e 1 hora antes do horário.

Os lembretes são recalculados sempre que os dados mudam. O sino da tela Início mostra os lembretes do dia.
Para testar: cadastre um medicamento em uso com um horário daqui a alguns minutos e aguarde. Notificações só funcionam no celular, não na versão web.

## Hash do commit

Em **Perfil › Sobre o app** aparecem o nome, a versão e o hash do commit (curto e completo) que gerou o build. Ele é gravado no build por `app.config.js`, para conferir a versão instalada com o código do repositório.

## Arquitetura

```
src/
├── interfaces/   Tipos TypeScript (contratos das APIs)
├── services/     HTTP, AsyncStorage e notificações
├── domain/       Regras de negócio puras (validações, lembretes)
├── hooks/        TanStack Query, única ponte entre telas e serviços
├── providers/    Sessão e cache
├── theme/        Tema claro e escuro
├── navigation/   Rotas e navegação por notificação
├── components/   Componentes de UI reutilizáveis
├── screens/      Telas (apenas UI e hooks)
├── styles/       Estilos por tela
└── utils/        Formatação e datas
```

## Como rodar

Requer Node.js 20+ e o app Expo Go no celular (ou um emulador).

```bash
npm install
npx expo start
```

As URLs das APIs já estão configuradas, sem variáveis de ambiente. Para entrar, cadastre-se como tutor ou veterinário na tela de cadastro.

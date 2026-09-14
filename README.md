# Amandaba

Aplicativo mobile para tutores de pets acompanharem a saúde dos seus animais em um só lugar.

## Descrição do problema e da solução

Tutores de pets normalmente têm o histórico de saúde dos seus animais espalhado em papéis, carteirinhas de vacinação, mensagens com o veterinário ou simplesmente na memória - o que dificulta manter um controle organizado e ter essas informações à mão quando são realmente necessárias (numa consulta, numa emergência, ou só para acompanhar a evolução do pet).

O **AmandaBa** resolve isso centralizando, em um app mobile, o cadastro e o histórico de saúde de cada pet do tutor:

- Cadastro de pets (espécie, raça, sexo, data de nascimento, foto, etc.)
- Registro de peso ao longo do tempo
- Registro de vacinas aplicadas (a partir de um catálogo real de vacinas)
- Registro de doenças, alergias e medicamentos em uso
- Registro de exames realizados e seus resultados
- Geração de um plano de cuidados sugerido por IA, a partir do histórico clínico registrado do pet

Todos os dados exibidos vêm de APIs reais (nenhuma informação fictícia é usada no app) - o cadastro/login é feito por uma API própria de autenticação, e todo o domínio de pets/tutores é gerenciado por uma segunda API.

## Tecnologias utilizadas

**App mobile**
- React Native + Expo (SDK 57), TypeScript
- React Navigation (`native-stack` + `bottom-tabs`)
- `expo-linear-gradient`, `@expo-google-fonts` (Bebas Neue, Poppins), `@expo/vector-icons`

**Backend (repositórios separados, consumidos via HTTP)**
- API de autenticação (Java / Spring Boot) - cadastro e login do usuário
- API de domínio (.NET) - tutores, pets, vacinas, doenças, alergias, medicamentos, exames, peso e plano de cuidados gerado por IA

Ambas as APIs estão publicadas no Render e são consumidas diretamente pelo app, sem dados mockados.

## Como executar o projeto

Pré-requisitos: Node.js e npm instalados. Para rodar no celular, o app [Expo Go](https://expo.dev/go); para rodar no navegador, nenhuma ferramenta extra é necessária.

O app já se conecta automaticamente às APIs publicadas - não é necessário configurar nenhuma variável de ambiente. Como as APIs estão hospedadas no plano gratuito do Render, a primeira requisição após um período sem uso pode levar até ~60-90 segundos até o servidor "acordar".

## Escopo desta entrega (Sprint 3)

- Perfil **Tutor**: cadastro, login, gestão completa de pets (cadastro, listagem, detalhe, inativação), vacinas, doenças, alergias, medicamentos, exames, peso e plano de cuidados por IA.
- Perfil **Veterinário**: ainda não implementado nesta sprint (fora de escopo).
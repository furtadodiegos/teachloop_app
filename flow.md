📱 MiniLoop – Fluxo do Aluno (Student)

O fluxo do aluno precisa contemplar:

Login → Home

Ver tutores

Agendar sessão

Comprar créditos

Assistir sessão

Ver relatório

Estrutura geral em tabs, igual ao TeachLoop:

(Home) – (Minhas Sessões) – (Créditos) – (Conta)

1. Tela de Login / Onboarding

Objetivo: entrar no app + selecionar contexto “student”.

Elementos:

Campo e-mail

Campo senha

Botão “Entrar”

Link “Criar conta”

Botão “Entrar com Google”

Option de escolher papel: Student ou Tutor

HOME (Aluno) 2. Tela Home (Lista de Tutores)

Objetivo: descobrir tutores disponíveis.

Elementos:

Header: “Encontre um Tutor”

Lista simples de tutores:

avatar

nome

matérias (lista curta)

botão “Ver Perfil”

Barra de busca (opcional)

Filtro por matéria (opcional)

Ações:

Clicar em tutor → Tela de Perfil do Tutor

3. Tela de Perfil do Tutor

Objetivo: visualizar informações essenciais e agendar sessão.

Elementos:

Avatar grande

Nome

Bio

Matérias (tags)

Preço (ex: “1 crédito por sessão”)

Botão “Agendar Sessão”

Ações:

Clicar em "Agendar Sessão" → Tela de Agendamento

4. Tela Agendar Sessão

Objetivo: permitir escolher horário e confirmar.

Elementos:

Título: “Agendar com {Tutor}”

Select / picker de data

Select / picker de horário

Indicador de custo em créditos

Botão “Confirmar Agendamento”

Ações:

Ao confirmar → Cria session no Convex + Debita créditos (ou informa que precisa comprar)

MINHAS SESSÕES (Aluno) 5. Tela Lista Minhas Sessões

Objetivo: ver futuras e passadas.

Elementos:

Tabs:

Futuras (scheduled)

Passadas (completed)

Cada sessão exibe:

Tutor

Data e hora

Status

Botão “Entrar na Sessão” (se dentro do horário)

Botão “Ver Relatório” (se completed)

6. Tela Detalhes da Sessão

Objetivo: info completa da aula.

Elementos:

Tutor

Data e hora

Assunto

Botão “Entrar na Sessão”

Status

Créditos cobrados

Link pra relatório (se existir)

Ações:

Abrir sessão (chama videoSessionUrl)

7. Tela Relatório da Aula (LessonReport)

Baseada no modelo do TeachLoop (“AI-generated session summaries”).

Elementos:

Título: “Relatório da Aula”

Resumo (texto)

Tópicos abordados (bullets)

Próximos passos

Botão “Baixar PDF” (opcional)

Botão “Compartilhar” (opcional)

Conteúdo vem da tabela lessonReports.

CRÉDITOS (Aluno) 8. Tela Saldo de Créditos

Objetivo: ver saldo e comprar mais.

Elementos:

Saldo atual (ex: “5 créditos”)

Histórico (listagem do creditsLedger)

Botão “Comprar Créditos”

9. Tela Comprar Créditos

Objetivo: chamar o Stripe Checkout.

Elementos:

Pacote único (ex: “Pacote 5 Créditos – R$ 50”)

Descrição simples

Botão “Comprar com cartão (Stripe)”

Ações:

Abre checkoutUrl retornado pelo backend

CONTA (Aluno) 10. Tela Conta / Perfil

Objetivo: gestão básica.

Elementos:

Nome

E-mail

Avatar

Papel atual (“Student”)

Botão “Sair”

Botão “Editar Perfil” (opcional)

📱 Fluxo do Tutor

O tutor precisa:

Login

Ver a agenda dele

Iniciar sessão

Fazer upload da gravação (fake)

Gerar relatório automático

Ver histórico

Tabs:

(Meus Alunos) – (Agenda) – (Conta)

1. Tela Home (Tutor) – Meus Alunos

Objetivo: visão rápida dos alunos com quem já teve sessões.

Elementos:

Lista de alunos (baseada nas sessões existentes)

Cada card:

Nome do aluno

Última sessão

Botão “Ver sessões”

Apenas navegação, não é fluxo principal.

2. Tela Agenda de Sessões

É a principal para o tutor.

Elementos:

Tabs:

Próximas sessões

Sessões passadas

Cada card mostra:

Nome do aluno

Horário

Status

Botão “Iniciar Sessão”

Ação principal:

“Iniciar Sessão” → abre URL do Agora App Builder (videoSessionUrl).

Igual ao TeachLoop: abre browser/webview.

3. Tela Detalhe da Sessão (Tutor)

Quando sessão termina, o tutor vê:

Elementos:

Dados da sessão

Horário

Dados do aluno

Status da transcrição

“Aguardando gravação”

“Aguardando transcrição”

“Transcrição concluída”

Botão “Enviar áudio/gravação”

envia arquivo fake para S3 / \_storage

Botão “Gerar Relatório”

dispara action: Deepgram → OpenAI → cria lessonReports

4. Tela Relatório Gerado (Tutor)

Objetivo: tutor revisa o relatório antes do aluno ver (opcional).

Elementos:

Resumo

Tópicos

Próximos Passos

Botão “Publicar para o Aluno” (ou já publicar automático)

5. Tela Conta (Tutor)

Elementos:

Nome

Bio (editable)

Matérias que ensina (tags)

Avatar

Botão “Editar Perfil”

Botão “Sair”

🎯 Recap das telas por perfil (rápido)
📘 Aluno

Login

Home (Tutores)

Perfil do Tutor

Agendar Sessão

Minhas Sessões (lista)

Detalhes da Sessão

Relatório

Créditos

Comprar Créditos

Conta

📕 Tutor

Login

Home (Meus Alunos)

Agenda

Detalhes da Sessão

Upload de gravação

Gerar relatório

Ver relatório

Conta

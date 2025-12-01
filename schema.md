Visão geral do schema

Pra cobrir os fluxos que planejamos, você vai precisar mais ou menos de:

Auth & perfis

users

tutorProfiles

studentProfiles

Tutoria & agendamento

subjects (bem simples)

sessions

Pagamentos & créditos

creditPurchaseOrders

creditsLedger

Sessão, gravação, AI

sessionRecordings

deepgramWebhooks (log)

lessonReports

Notificações / suporte

notifications (simples, opcional, mas útil)

(e-mails mesmo ficam no Resend; templates em packages/email )

E sempre lembrando a filosofia deles: usar índices pra tudo e retornar só o necessário pros apps.

1. Auth & Perfis
   1.1. users

Baseado na abordagem do TeachLoop com Convex Auth e contextos (parent, tutor, student)

Objetivo: representar a conta de login e o contexto atual.

Campos principais:

id — ID interno

email — e-mail de login (único)

name — nome exibido

context — "student" | "tutor" | "admin"

studentProfileId — referência opcional a studentProfiles

tutorProfileId — referência opcional a tutorProfiles

createdAt — timestamp (ms)

updatedAt — timestamp (ms)

Índices sugeridos:

by_email → campo: email

uso: autenticação, busca de usuário

by_context → campo: context

uso: listar rapidamente só tutores ou só admins

eventualmente by_tokenIdentifier, se quiser espelhar Convex Auth bem perto do que eles fazem.

1.2. tutorProfiles

Objetivo: dados específicos de tutor (bio, matérias etc).

Campos:

id

userId — referência para users

displayName

bio

subjects — lista de IDs de subjects (ou strings)

hourlyCreditsPrice — número de créditos por sessão (se quiser algo dinâmico)

avatarStorageId ou avatarS3Key — pra treinar S3 ou \_storage

createdAt

updatedAt

Índices:

by_user → userId

uso: pegar o perfil a partir do usuário logado

by_subject → exemplo: primeiro item de subjects ou um campo primarySubjectId

uso: listagem por matéria (no app e backoffice)

1.3. studentProfiles

Pra simplificar, podemos tratar “aluno” como “usuário com contexto student + perfil vinculado”.

Campos:

id

userId — referência para users

displayName

createdAt

updatedAt

Índices:

by_user → userId

2. Tutoria & Agendamento
   2.1. subjects

Muito simples, só pra treinar relacionamento.

Campos:

id

name — ex: “Math”, “English”

slug — ex: "math", "english"

createdAt

Índices:

by_slug → slug (pra achar por slug)

by_name → name (se quiser auto-complete ou ordenação)

2.2. sessions

Essa tabela é o coração da tutoria, inspirada na estrutura de sessões/bookings do backend do TeachLoop.

Objetivo: representar uma sessão agendada entre aluno e tutor.

Campos:

id

tutorProfileId — referência para tutorProfiles

studentProfileId — referência para studentProfiles

subjectId — referência para subjects (opcional, mas legal)

startTime — timestamp (ms)

endTime — timestamp (ms, opcional, pode ser calculado)

status — "scheduled" | "in_progress" | "completed" | "cancelled"

creditsCost — quantos créditos essa sessão consome (ex: 1 ou 2)

agoraChannelName — string com nome do canal App Builder

agoraHostPassPhrase — string

agoraViewerPassPhrase — string (se for usar)

videoSessionUrl — URL final de join (pode ser derivado de SESSIONS_APP_URL + passphrase, mas pode guardar pronto)

createdAt

updatedAt

Índices:

by_tutor_and_time → campos: tutorProfileId, startTime

uso: listar agenda futura/passada do tutor

by_student_and_time → studentProfileId, startTime

uso: listar sessões do aluno

by_status_and_time → status, startTime

uso: backoffice listar sessões pendentes/completas

3. Pagamentos & Créditos

TeachLoop usa uma infraestrutura de créditos + Stripe bem estruturada, incluindo creditPurchaseOrders e um “ledger” de créditos.

3.1. creditPurchaseOrders

Versão enxuta: 1 tipo de pacote, mas mesma lógica.

Campos:

id

userId — quem está comprando (student)

stripeCheckoutSessionId — string

stripePaymentIntentId — string (opcional)

totalCredits — ex: 5

totalCents — ex: 5000

status — "pending" | "completed" | "failed" | "expired"

completedAt — timestamp (ms, opcional)

failedAt

expiredAt

createdAt

updatedAt

Índices:

by_user_and_createdAt → userId, createdAt

uso: histórico de compras do usuário

by_checkoutSessionId → stripeCheckoutSessionId

uso: tratar webhooks Stripe e achar o pedido correspondente

Como você só vai ter 1 tipo de produto, dá pra pular a tabela de creditPurchaseOrderItems e products/productPrices por enquanto, mas se quiser treinar exatamente o modelo deles, dá pra adicionar reduzido depois.

3.2. creditsLedger

É o “extrato” de créditos, como na doc deles: cada compra e cada sessão gera uma linha de crédito ou débito.

Campos:

id

userId — donos dos créditos (aluno)

type — "credit" | "debit"

amount — número de créditos (positivo sempre)

balanceAfter — saldo logo após essa operação (opcional, mas útil)

source — "purchase" | "session_booking" | "session_refund" | "manual_adjustment"

purchaseOrderId — referência para creditPurchaseOrders (quando source = "purchase")

sessionId — referência para sessions (quando source for sessão)

description — string explicando (ex: “Compra de 5 créditos”, “Sessão com tutor X”)

createdAt

Índices:

by_user_and_createdAt → userId, createdAt

uso: calcular saldo e mostrar extrato (ordenado por data)

by_session → sessionId

uso: verificar se sessão já debitou/creditou alguma coisa (evitar duplicidade)

Recomendo calcular o saldo no backend sempre somando as linhas ou usar balanceAfter pra evitar recomputar toda hora.

4. Sessão, Gravação, Transcrição & Relatório

TeachLoop usa sessionRecordings, webhooks da Deepgram e depois integra com OpenAI pra gerar relatórios.

4.1. sessionRecordings

Objetivo: guardar a ligação entre sessão e arquivo de áudio.

Campos:

id

sessionId — referência para sessions

storageFileId ou s3Key — depende se você usar Convex \_storage ou S3

transcriptionStatus — "pending" | "processing" | "completed" | "failed"

transcriptionText — texto completo (opcional, preenchido quando pronto)

transcriptionMeta — objeto simples:

confidence — número médio

language — ex: "en"

transcriptionError — string (erro quando falhar)

deepgramRequestId — string

createdAt

updatedAt

Índices:

by_session → sessionId

uso: achar gravação da sessão

by_status → transcriptionStatus

uso: achar pendentes/processando (se quiser reprocessar ou monitorar)

4.2. deepgramWebhooks

Igual ao que o TeachLoop faz: logar webhooks pra debug.

Campos:

id

sessionRecordingId — referência opcional para sessionRecordings

requestId — ID do Deepgram

eventType — "transcription_complete" | "transcription_failed" | outro

payload — objeto com o JSON que veio do webhook (talvez truncado)

processedAt — timestamp (ms)

Índices:

by_requestId → requestId

by_recording → sessionRecordingId

4.3. lessonReports

Depois de transcrever, você usa OpenAI pra gerar o relatório de aula (TeachLoop faz isso pros “AI lesson reports”).

Campos:

id

sessionId — referência para sessions

studentProfileId

tutorProfileId

summary — resumo em 1–2 parágrafos

topicsCovered — lista de tópicos/bullets

nextSteps — sugestões para próxima aula/dever de casa

rawTranscript — talvez referencie sessionRecordings.transcriptionText ou duplique (aí é escolha sua)

createdAt

Índices:

by_session → sessionId

uso: pegar relatório da sessão

by_student_and_createdAt → studentProfileId, createdAt

uso: listar histórico de relatórios do aluno

5. Notificações / E-mails
   5.1. notifications

Mesmo com Resend fazendo e-mail, é legal ter uma tabela simples de notificações in-app (TeachLoop usa um sistema de notificações, com e-mail via Resend + notificações internas).

Campos:

id

userId — para quem é a notificação

type — "session_scheduled" | "report_ready" | "payment_completed" | ...

data — objeto com informações (id da sessão, etc.)

read — boolean

createdAt

Índices:

by_user_and_createdAt → userId, createdAt

by_user_and_read → userId, read

uso: listar notificações não lidas

6. Resumo rápido das tabelas e índices

Pra ficar bem enxuto na sua cabeça:

Auth & perfis

users → índices: by_email, by_context

tutorProfiles → by_user, by_subject

studentProfiles → by_user

Tutoria & agendamento

subjects → by_slug, by_name

sessions → by_tutor_and_time, by_student_and_time, by_status_and_time

Pagamentos & créditos

creditPurchaseOrders → by_user_and_createdAt, by_checkoutSessionId

creditsLedger → by_user_and_createdAt, by_session

Sessões, AI e gravação

sessionRecordings → by_session, by_status

deepgramWebhooks → by_requestId, by_recording

lessonReports → by_session, by_student_and_createdAt

Notificações

notifications → by_user_and_createdAt, by_user_and_read

Isso já é um schema super realista, inspirado diretamente nos docs do TeachLoop (pagamentos, integrações, backend).

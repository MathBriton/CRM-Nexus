-- ============================================================
-- CRM-Nexus — Seed de Dados Iniciais
-- Execute APÓS o arquivo de migrations.
-- As senhas abaixo são hash bcrypt de "Senha@123" (custo 12).
-- Troque ANTES de ir para produção.
-- ============================================================

-- ─── USUÁRIOS ───────────────────────────────────────────────
INSERT INTO auth.Usuarios (Nome, Email, SenhaHash, Nivel) VALUES
('Admin Sistema',     'admin@crmnexus.local',   '$2a$12$PLACEHOLDER_HASH_ADMIN',   5),
('Gerente Comercial', 'gerente@crmnexus.local',  '$2a$12$PLACEHOLDER_HASH_GERENTE', 4),
('Vendedor Alpha',    'alpha@crmnexus.local',    '$2a$12$PLACEHOLDER_HASH_ALPHA',   2),
('Vendedor Beta',     'beta@crmnexus.local',     '$2a$12$PLACEHOLDER_HASH_BETA',    2);
GO

-- ─── EMPRESAS ───────────────────────────────────────────────
-- CriadoPorId = 1 (Admin)
INSERT INTO crm.Empresas (RazaoSocial, NomeFantasia, CNPJ, Segmento, Website, Telefone, CriadoPorId) VALUES
('Nexus Tecnologia Ltda',           'NexusTech',      '12345678000195', 'Tecnologia',     'https://nexustech.com.br',    '(11) 91234-5678', 1),
('Omega Logística S.A.',            'OmegaLog',       '98765432000101', 'Logística',      'https://omegalog.com.br',     '(21) 98765-4321', 1),
('Delta Indústria e Comércio Ltda', 'Delta Ind.',     '45678901000134', 'Indústria',      NULL,                          '(31) 93456-7890', 2),
('Sigma Consultoria Ltda',          'SigmaCons',      '65432198000177', 'Consultoria',    'https://sigmaconsultoria.com', '(41) 94567-8901', 2),
('Alpha Varejo Eireli',             'Alpha Varejo',   '32165498000112', 'Varejo',         NULL,                          '(51) 95678-9012', 3);
GO

-- ─── CONTATOS ───────────────────────────────────────────────
INSERT INTO crm.Contatos (EmpresaId, Nome, Cargo, Email, Telefone, CriadoPorId) VALUES
(1, 'Carlos Mendes',   'Diretor de TI',         'carlos@nexustech.com.br',   '(11) 91111-1111', 3),
(1, 'Fernanda Lima',   'Gerente de Compras',    'fernanda@nexustech.com.br', '(11) 92222-2222', 3),
(2, 'Roberto Souza',   'CEO',                   'roberto@omegalog.com.br',   '(21) 93333-3333', 3),
(3, 'Ana Paula Costa', 'Diretora Financeira',   'anapaula@deltaind.com.br',  '(31) 94444-4444', 4),
(4, 'Marcos Oliveira', 'Sócio-Gerente',         'marcos@sigmaconsultoria.com','(41) 95555-5555', 4),
(5, 'Julia Ramos',     'Compradora Sênior',     'julia@alphavarejo.com.br',  '(51) 96666-6666', 4);
GO

-- ─── OPORTUNIDADES ──────────────────────────────────────────
INSERT INTO crm.Oportunidades
    (EmpresaId, ContatoId, ResponsavelId, Titulo, ValorEstimado, Etapa, DataFechamentoPrevista, Observacoes)
VALUES
(1, 1, 3, 'Implantação CRM — NexusTech',          85000.00,  'Proposta',       '2026-06-30', 'Cliente aguarda apresentação da demo.'),
(2, 3, 3, 'Contrato Anual Suporte — OmegaLog',    120000.00, 'Negociação',     '2026-05-15', 'Em fase final, aguardando aprovação jurídica.'),
(3, 4, 4, 'Módulo Financeiro — Delta Ind.',        48000.00,  'Qualificação',   '2026-07-31', NULL),
(4, 5, 4, 'Consultoria em Processos — SigmaCons',  32000.00,  'Prospecção',     NULL,         'Contato inicial feito via LinkedIn.'),
(5, 6, 3, 'Plataforma E-commerce — Alpha Varejo',  75000.00,  'Fechado Ganho',  '2026-03-01', 'Contrato assinado. Iniciar onboarding.');
GO

-- ─── ATIVIDADES ─────────────────────────────────────────────
INSERT INTO crm.Atividades
    (OportunidadeId, ContatoId, RealizadaPorId, Tipo, Descricao, DataRealizacao, Concluida)
VALUES
(1, 1, 3, 'Reunião',  'Apresentação inicial do produto ao Diretor de TI.', '2026-04-01 10:00', 1),
(1, 2, 3, 'E-mail',   'Envio da proposta comercial para Gerente de Compras.','2026-04-05 14:30', 1),
(2, 3, 3, 'Ligação',  'Ligação para discutir cláusulas contratuais.',       '2026-04-10 09:15', 1),
(3, 4, 4, 'Reunião',  'Reunião de descoberta para mapear necessidades.',    '2026-04-08 15:00', 1),
(4, 5, 4, 'Nota',     'Cliente demonstrou interesse após post no LinkedIn.', '2026-04-12 11:00', 1),
(5, 6, 3, 'Tarefa',   'Preparar documento de kickoff para onboarding.',     '2026-04-15 08:00', 0);
GO

-- ============================================================
-- VERIFICAÇÃO rápida após seed
-- ============================================================
SELECT 'Usuários'      AS Tabela, COUNT(*) AS Registros FROM auth.Usuarios
UNION ALL
SELECT 'Empresas',      COUNT(*) FROM crm.Empresas
UNION ALL
SELECT 'Contatos',      COUNT(*) FROM crm.Contatos
UNION ALL
SELECT 'Oportunidades', COUNT(*) FROM crm.Oportunidades
UNION ALL
SELECT 'Atividades',    COUNT(*) FROM crm.Atividades;
GO

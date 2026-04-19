-- ============================================================
-- CRM-Nexus — Schema Inicial
-- Execute este arquivo UMA VEZ para criar as tabelas.
-- Ordem importa: respeitar FKs.
-- ============================================================

-- ─── SCHEMAS ────────────────────────────────────────────────
CREATE SCHEMA auth;
GO
CREATE SCHEMA crm;
GO

-- ============================================================
-- SCHEMA: auth
-- ============================================================

CREATE TABLE auth.Usuarios (
    Id          INT            IDENTITY(1,1) PRIMARY KEY,
    Nome        NVARCHAR(100)  NOT NULL,
    Email       NVARCHAR(150)  NOT NULL UNIQUE,
    SenhaHash   NVARCHAR(256)  NOT NULL,   -- bcrypt hash
    Nivel       TINYINT        NOT NULL DEFAULT 1,  -- 1=Viewer … 5=Admin
    Ativo       BIT            NOT NULL DEFAULT 1,
    CriadoEm   DATETIME2      NOT NULL DEFAULT GETDATE(),
    AtualizadoEm DATETIME2    NULL
);
GO

-- ============================================================
-- SCHEMA: crm
-- ============================================================

-- Empresas (contas / accounts)
CREATE TABLE crm.Empresas (
    Id          INT            IDENTITY(1,1) PRIMARY KEY,
    RazaoSocial NVARCHAR(150)  NOT NULL,
    NomeFantasia NVARCHAR(150) NULL,
    CNPJ        CHAR(14)       NULL UNIQUE,
    Segmento    NVARCHAR(80)   NULL,
    Website     NVARCHAR(200)  NULL,
    Telefone    NVARCHAR(20)   NULL,
    CriadoPorId INT            NOT NULL REFERENCES auth.Usuarios(Id),
    CriadoEm   DATETIME2      NOT NULL DEFAULT GETDATE(),
    AtualizadoEm DATETIME2    NULL
);
GO

-- Contatos (pessoas dentro de uma empresa)
CREATE TABLE crm.Contatos (
    Id          INT            IDENTITY(1,1) PRIMARY KEY,
    EmpresaId   INT            NULL REFERENCES crm.Empresas(Id),
    Nome        NVARCHAR(100)  NOT NULL,
    Cargo       NVARCHAR(80)   NULL,
    Email       NVARCHAR(150)  NULL,
    Telefone    NVARCHAR(20)   NULL,
    LinkedIn    NVARCHAR(200)  NULL,
    CriadoPorId INT            NOT NULL REFERENCES auth.Usuarios(Id),
    CriadoEm   DATETIME2      NOT NULL DEFAULT GETDATE(),
    AtualizadoEm DATETIME2    NULL
);
GO

-- Pipeline de negócios (Oportunidades)
-- Etapas possíveis do funil:
--   Prospecção → Qualificação → Proposta → Negociação → Fechado (Ganho/Perdido)
CREATE TABLE crm.Oportunidades (
    Id              INT             IDENTITY(1,1) PRIMARY KEY,
    EmpresaId       INT             NOT NULL REFERENCES crm.Empresas(Id),
    ContatoId       INT             NULL REFERENCES crm.Contatos(Id),
    ResponsavelId   INT             NOT NULL REFERENCES auth.Usuarios(Id),
    Titulo          NVARCHAR(150)   NOT NULL,
    ValorEstimado   DECIMAL(15,2)   NULL,
    Etapa           NVARCHAR(30)    NOT NULL DEFAULT 'Prospecção',
        -- CHECK garante valores válidos no banco — validação também no backend
        CONSTRAINT CK_Oportunidades_Etapa CHECK (Etapa IN (
            'Prospecção', 'Qualificação', 'Proposta', 'Negociação',
            'Fechado Ganho', 'Fechado Perdido'
        )),
    DataFechamentoPrevista DATE     NULL,
    Observacoes     NVARCHAR(MAX)   NULL,
    CriadoEm       DATETIME2       NOT NULL DEFAULT GETDATE(),
    AtualizadoEm   DATETIME2       NULL
);
GO

-- Atividades (ligações, reuniões, e-mails, tarefas)
CREATE TABLE crm.Atividades (
    Id              INT             IDENTITY(1,1) PRIMARY KEY,
    OportunidadeId  INT             NULL REFERENCES crm.Oportunidades(Id),
    ContatoId       INT             NULL REFERENCES crm.Contatos(Id),
    RealizadaPorId  INT             NOT NULL REFERENCES auth.Usuarios(Id),
    Tipo            NVARCHAR(30)    NOT NULL,
        CONSTRAINT CK_Atividades_Tipo CHECK (Tipo IN (
            'Ligação', 'Reunião', 'E-mail', 'Tarefa', 'Nota'
        )),
    Descricao       NVARCHAR(MAX)   NOT NULL,
    DataRealizacao  DATETIME2       NOT NULL DEFAULT GETDATE(),
    Concluida       BIT             NOT NULL DEFAULT 0
);
GO

-- ============================================================
-- ÍNDICES de performance (colunas usadas em WHERE / JOIN)
-- ============================================================
CREATE INDEX IX_Empresas_CNPJ         ON crm.Empresas(CNPJ);
CREATE INDEX IX_Contatos_EmpresaId    ON crm.Contatos(EmpresaId);
CREATE INDEX IX_Oportunidades_Etapa   ON crm.Oportunidades(Etapa);
CREATE INDEX IX_Oportunidades_Resp    ON crm.Oportunidades(ResponsavelId);
CREATE INDEX IX_Atividades_Oprt       ON crm.Atividades(OportunidadeId);
GO

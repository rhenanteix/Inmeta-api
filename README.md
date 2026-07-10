# Inmeta-api — API de Gerenciamento de Documentação de Colaboradores

Esta é uma API REST robusta desenvolvida em **NestJS** e **TypeScript** para gerenciar o ciclo de vida documental de colaboradores dentro de uma organização. O sistema mitiga riscos de conformidade trabalhista ao gerenciar com precisão a obrigatoriedade de documentos, a detecção de pendências de envio, e o versionamento histórico de arquivos de forma transacional e segura.

## 🚀 Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/) (v10+)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma ORM](https://www.prisma.io/) (v6.19.3)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Validação:** `class-validator` e `class-transformer`
- **Logger:** [Pino Logger](https://github.com/pinojs/pino) (`nestjs-pino`)
- **Suíte de Testes:** [Jest](https://jestjs.io/)
- **Containerização:** [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## Estrutura de Pastas

A arquitetura segue o padrão modular e escalável recomendado pelo NestJS:

```text
src/
├── common/                  # Middlewares, interceptors, decorators, filtros e DTOs globais
├── database/
│   ├── prisma/              # Configuração e inicialização do PrismaService
│   └── schema.prisma        # Definição das entidades e relacionamentos do banco
├── health/                  # Módulo de monitoramento e Health Check da API
├── dashboard/               # Módulo de agregação de dados quantitativos e estatísticas
└── modules/
    ├── employee/            # Gestão e ciclo de vida do colaborador
    ├── document-type/       # Parametrização e regras de tipos de documentos
    ├── employee-document/   # Vínculo de obrigatoriedade (tabela pivô) e pendências
    └── document/            # Motor de envio lógico e controle estrito de versões

    Modelagem de Dados e Relacionamentos
Todas as entidades utilizam identificadores únicos universais (UUID), registram carimbos de data (createdAt, updatedAt) e implementam a estratégia de Soft Delete (deletedAt) para exclusão lógica.

Employee (1 : N) EmployeeDocument: Um funcionário pode ter várias obrigatoriedades vinculadas.

DocumentType (1 : N) EmployeeDocument: Um tipo de documento pode fazer parte de múltiplos vínculos.

EmployeeDocument (1 : 1) Document: Cada vínculo possui, facultativamente, um registro de documento real entregue.

Document (1 : N) DocumentVersion: Um documento mantém o histórico de todas as atualizações enviadas através de versões.

💼 Regras de Negócio & Transações
Bloqueio de Duplicidade: O sistema impede, por meio de chaves e validações transacionais, que um colaborador tenha mais de um vínculo ativo para o mesmo tipo de documento.

Criação Automática: No primeiro envio de arquivo para um determinado vínculo, o registro pai Document é gerado automaticamente em conjunto com a sua primeira DocumentVersion.

Controle Estrito de Versões: Envios subsequentes criam novas linhas em DocumentVersion. O sistema garante, via prisma.$transaction, que apenas uma única versão permaneça com o status ACTIVE no banco, marcando as anteriores como ARCHIVED.

Evolução de Estado: O status de um EmployeeDocument transiciona automaticamente de PENDING para COMPLETED assim que o primeiro documento válido é anexado.

Matriz de Endpoints (API REST)

Colaboradores (Employees)
POST /employees - Cadastra um novo colaborador.

GET /employees - Lista colaboradores ativos (suporta paginação/filtros).

GET /employees/:id - Detalha um colaborador específico.

PATCH /employees/:id - Atualiza parcialmente os dados de um colaborador.

DELETE /employees/:id - Remove logicamente um colaborador (Soft Delete).

Tipos de Documentos (Document Types)
POST /document-types - Cadastra um novo tipo de documento.

GET /document-types - Lista todas as tipagens documentais ativas.

GET /document-types/:id - Detalha um tipo de documento específico.

PATCH /document-types/:id - Modifica parâmetros da tipagem.

DELETE /document-types/:id - Desativa logicamente a tipagem (Soft Delete).

Vínculos e Pendências (Employee Documents)
POST /employee-documents/:employeeId/link - Vincula obrigatoriedade de documento a um funcionário.

DELETE /employee-documents/:employeeId/:documentTypeId - Desvincula e apaga logicamente a obrigatoriedade.

GET /employee-documents/:employeeId - Exibe a grade completa e status de documentos de um funcionário.

GET /employee-documents/pending - Lista global de pendências com suporte a filtros e paginação.

Envio de Arquivos (Documents)
POST /documents/send - Processa o upload lógico e gerencia a criação de novas versões do arquivo.

Como Executar o Projeto
Siga os passos abaixo para configurar o ambiente isolado via Docker e sincronizar o banco de dados.

1. Clonar o Repositório e Instalar Dependências
Bash
git clone [https://github.com/rhenanteix/Inmeta-api.git](https://github.com/rhenanteix/Inmeta-api.git)
cd Inmeta-api
npm install
2. Inicializar a Infraestrutura (PostgreSQL no Docker)
O projeto inclui um ficheiro docker-compose.yml pré-configurado. Certifique-se de que a porta 5432 não está a ser utilizada na sua máquina e execute:

Bash
docker-compose up -d
Este comando irá descarregar a imagem postgres:15-alpine e inicializar o banco de dados em segundo plano.

3. Configurar as Variáveis de Ambiente
Crie um ficheiro nomeado .env na raiz do projeto e insira a string de ligação direcionada para o container Docker:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/document_manager?schema=public"
PORT=3000
4. Sincronizar o Prisma ORM e Rodar as Migrations
Com o banco de dados ativo dentro do Docker, execute os comandos do Prisma para compilar as tipagens do cliente e estruturar fisicamente as tabelas:

Bash
# Gera o Prisma Client fortemente tipado baseado no seu schema
npx prisma generate

# Executa as migrations para aplicar as tabelas estruturais no PostgreSQL
npx prisma migrate dev --name init
5. Iniciar a Aplicação
Para rodar a API em ambiente de desenvolvimento com monitorização de alterações (Hot Reload):

Bash
npm run start:dev
A API estará disponível em: http://localhost:3000

🧪 Executando os Testes Automatizados
A aplicação conta com uma suite de testes unitários isolados com mocks do Prisma para garantir a integridade das regras de negócio sem poluir o banco de dados real.

Para rodar todos os testes de serviço:

Bash
npm test
Para rodar em modo watch (observador):

Bash
npm run test:watch

Melhorias Futuras (Roadmap)

[ ] Autenticação & Autorização: Implementação de JWT com controle de acessos baseado em perfis (RBAC).

[ ] Upload Físico (S3): Integração com Amazon S3 ou MinIO para persistência física dos ficheiros PDF/Imagens.

[ ] Documentação: Mapeamento completo das rotas utilizando Swagger (@nestjs/swagger).

[ ] Mensageria & Cache: Utilização de BullMQ/Redis para processamento assíncrono de ficheiros pesados e cache de relatórios.

[ ] Dockerização da API: Criação de um Dockerfile multi-stage para produção.


***
Desenvolvido por Rhenan Teixeira.
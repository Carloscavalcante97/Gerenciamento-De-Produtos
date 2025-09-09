# Products — API (Spring Boot) & Frontend (React)

Aplicação full‑stack para **gestão de produtos**, desenvolvida como parte de um **desafio técnico (prazo: 2 dias)**. O repositório é um monorepo com **backend (Java 17 + Spring Boot)** e **frontend (React + Vite + Tailwind)** e já inclui **Docker Compose** para subir tudo junto.

![Capa do projeto — Produtos](/Images/Example.png)

---

## Estrutura do projeto

```
.
├── products-api/          # Backend Spring Boot 3.5
├── products-frontend/     # Frontend React + Vite + Tailwind + shadcn/ui
├── docker-compose.yml     # Sobe frontend + backend
└── README.md
```

---

## Como executar

### 1) Com Docker Compose (recomendado)

Pré‑requisitos: Docker + Docker Compose instalados.

```bash
# na raiz do repo
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- H2 Console: http://localhost:8080/h2-console (JDBC: `jdbc:h2:mem:testdb`, user: `sa`, senha vazia)

### 2) Local (sem Docker)

**Pré-requisitos (execução local)**

- JDK 17
- Maven 3.9+
- Node 18+ e pnpm
- (Opcional) Docker + Docker Compose para subir tudo junto

#### Backend

```bash
cd products-api

# rodar apenas o back-end
mvn spring-boot:run
# rodar testes
mvn test

# rodar cobertura
mvn verify
```

- API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui/index.html

#### Frontend

```bash
cd products-frontend

pnpm install

pnpm dev
```

- Frontend (dev): http://localhost:3000 _(após mudar a porta no Vite)_

---

## Backend (products-api)

- **Stack**: Spring Boot 3.5.5, Java 17, Spring Data JPA, Validation, H2, Springdoc OpenAPI
- **Entidade**: `Product { id(UUID), name, description, price(BigDecimal), quantity(Integer), createdAt(LocalDateTime) }`
- **Validações (Bean Validation)** – em `ProductRequestDTO`:
  - `name`: **@NotBlank**
  - `price`: **@NotNull** + **@Min(1)** _(ideal seria `@DecimalMin` para BigDecimal – ver ajustes)_
  - `quantity`: **@NotNull** + **@Min(0)**
- **Tratamento de erros**: `GlobalExceptionHandler` retorna **400** com lista de mensagens no formato `"campo: mensagem"` para erros de validação.
- **CORS global**: `CorsGlobalConfig`.
- **Criação automática de data**: `createdAt` setado via `@PrePersist`.

### Endpoints principais

Base path: **`/api/products`**

- `GET /api/products?search&Pageable`  
  Lista paginada/ordenada. Parâmetros aceitos pelo Spring:  
  `page` (0‑based), `size`, `sort` (ex.: `sort=name,asc`).  
  Parâmetro opcional `search` filtra por **nome (contains, case‑insensitive)**.

- `GET /api/products/{id}`  
  Busca um produto pelo **UUID**.

- `POST /api/products`  
  Cria um produto. **Body (JSON)**:

  ```json
  {
    "name": "Notebook",
    "description": "14-inch screen, 16GB RAM",
    "price": 4500.0,
    "quantity": 10
  }
  ```

- `PUT /api/products/{id}` _(atualização parcial)_  
  Aceita `ProductUpdateRequestDTO` com campos **opcionais**. Exemplo:

  ```json
  { "price": 4999.9, "quantity": 12 }
  ```

- `DELETE /api/products/{id}`  
  Remove o produto (204 No Content).

### Swagger / OpenAPI

- UI: `http://localhost:8080/swagger-ui/index.html`
- JSON: `http://localhost:8080/v3/api-docs`

### Banco H2

- JDBC: `jdbc:h2:mem:testdb`
- Usuário: `sa` (sem senha)
- Console web: `http://localhost:8080/h2-console`

---

## Frontend (products-frontend)

- **Stack**: React 18 + Vite, TypeScript, Tailwind, shadcn/ui, TanStack Query, React Router, Framer Motion
- **Páginas / Fluxos**:
  - **Listagem** com paginação e ordenação (por nome, preço, data de criação).
  - **Busca** por nome (`search`).
  - **Criar / Editar** produto (modal).
  - **Excluir** produto (diálogo de confirmação).
  - **Toasts** de sucesso/erro.
- **Serviço HTTP**: Axios em `src/services/api.ts` (base URL fixa em `http://localhost:8080/api`).

---

## Testes & Cobertura

No backend:

```bash
cd products-api
mvn test
mvn verify

```

## ![Testes de cobertura — Produtos](/Images/Coverage-Result.png)

## Decisões de projeto (resumo)

- **Spring Pageable** para paginação/ordenação com baixo boilerplate.
- **DTOs** para separar contratos de entrada/saída da entidade JPA.
- **Tratamento de erros global** com mensagens simples (lista de strings).
- **React + TanStack Query** para cache/fetching, UI “clean” com **Tailwind**/**shadcn** e modais/diálogos.
- **Docker multi‑stage** para imagem enxuta da API e preview build do frontend.

---

## Autor

**Antônio Carlos B. Cavalcante Júnior**  
📧 [antonio.developer@icloud.com](mailto:antonio.developer@icloud.com) · 🔗 LinkedIn: https://linkedin.com/in/antonio-dev-

# Estacionamento — Controle de Entrada e Saída

Sistema para controle de estacionamento com registro de entrada/saída de veículos, cálculo de tempo e tarifa em tempo real, perfis Gerente e Funcionário e configuração flexível de preços.

---

## Proposta

O **Estacionamento** é uma aplicação web para gestão de vagas: registrar a entrada de veículos (placa, marca, modelo, cor), exibir o valor acumulado em tempo real e registrar a saída com o valor final calculado. O **Gerente** define como a tarifa funciona (valor inicial, intervalo de tempo e valor por intervalo); **Gerente e Funcionário** usam o mesmo fluxo de entrada e saída. Tudo é persistido em banco (SQLite) para auditoria e futuros relatórios.

---

## O que o sistema faz

### Autenticação e perfis

- **Login** com e-mail e senha (JWT).
- **Dois perfis:**
  - **Gerente:** acessa Estacionamento e **Configuração de Tarifa**.
  - **Funcionário:** acessa apenas Estacionamento (entrada/saída).

### Módulo Estacionamento

- **Registrar entrada:** informar placa, marca, modelo e cor do veículo.
  - Campos **Marca**, **Modelo** e **Cor** com **autocomplete** a partir de listas pré-definidas, com opção **"Outros"** para digitação livre.
  - Valores são salvos como **texto** no banco (facilita auditoria).
- **Listagem de veículos em aberto:** tabela com placa, marca/modelo, cor, horário de entrada, **valor atual** e botão para registrar saída.
- **Valor em tempo real:** a cada **2 segundos** o valor é recalculado e exibido na coluna "Valor atual" para cada veículo ainda estacionado.
- **Registrar saída:** ao confirmar a saída, o sistema calcula o valor final, grava a data/hora de saída e o valor cobrado, e **remove o veículo da lista** de em aberto.

### Módulo Config. Tarifa (apenas Gerente)

- **Configuração da cobrança:**
  - **Valor inicial** (R$): valor fixo ao entrar.
  - **Intervalo:** quantidade + unidade (**segundos**, **minutos** ou **horas**).
  - **Valor por intervalo** (R$): valor acrescido a cada intervalo completado.
- O cálculo usa **apenas o tempo real** (sem “hora virtual”); o gerente escolhe o intervalo que quiser (ex.: a cada 20 segundos, a cada 1 hora, etc.).
- Uma única configuração fica **ativa** por vez; ao salvar uma nova, as demais são desativadas.

### Regra de cálculo da tarifa

- Tempo de permanência = diferença entre horário de saída e horário de entrada (tempo real).
- Número de intervalos = tempo de permanência ÷ duração do intervalo (arredondado para cima).
- **Valor = valor inicial + (número de intervalos × valor por intervalo).**

Exemplo: valor inicial R$ 8,00; a cada 20 segundos adiciona R$ 0,30. Veículo fica 45 segundos → 3 intervalos → R$ 8,00 + 3 × R$ 0,30 = **R$ 8,90**.

---

## Stack

| Camada   | Tecnologia        |
|----------|-------------------|
| Frontend | Angular 18, Angular Material, RxJS |
| Backend  | NestJS 10, TypeORM, Passport JWT, class-validator |
| Banco    | SQLite (arquivo `estacionamento.db`) |

---

## Como rodar

### Pré-requisitos

- Node.js 18+ e npm.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

- API em **http://localhost:3000**
- Banco: `backend/estacionamento.db` (criado automaticamente)
- Na **primeira execução** são criados:
  - **Usuários:**  
    - `gerente@estacionamento.com` / `123456` (Gerente)  
    - `funcionario@estacionamento.com` / `123456` (Funcionário)
  - **Tarifa padrão:** valor inicial R$ 8,00; a cada 20 segundos + R$ 0,30

### Frontend

```bash
cd frontend
npm install
npm start
```

- Aplicação em **http://localhost:4200**
- As requisições para `/api/*` são enviadas ao backend em `http://localhost:3000` (proxy configurado no Angular).

---

## Estrutura do projeto

```
ESTACIONAMENTO/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── auth/               # Login, JWT, guards por perfil
│   │   ├── config-tarifa/      # CRUD e ativação da tarifa (Gerente)
│   │   ├── estacionamento/     # Entrada, saída, listagem em aberto
│   │   ├── entities/           # User, ConfigTarifa, RegistroEstacionamento
│   │   └── seed/               # Usuários e tarifa inicial
│   └── estacionamento.db       # SQLite (gerado ao rodar)
├── frontend/                   # SPA Angular
│   └── src/app/
│       ├── core/               # Auth, guards, interceptor HTTP
│       ├── layout/             # Menu lateral, toolbar, menu do usuário
│       └── features/
│           ├── login/
│           ├── estacionamento/ # Formulário de entrada, tabela em aberto, valor em tempo real
│           └── config-tarifa/  # Formulário de tarifa (Gerente)
└── README.md
```

---

## Próximos passos (futuro)

- Módulo para **consultar registros com baixa** (saídas já registradas), com filtros por data, placa, etc.

---

## Resumo

| Item | Descrição |
|------|-----------|
| **Proposta** | Controle de estacionamento com entrada/saída, valor em tempo real e tarifa configurável pelo gerente. |
| **Perfis** | Gerente (estacionamento + config. tarifa) e Funcionário (apenas estacionamento). |
| **Cálculo** | Tempo real; intervalo e valores definidos pelo gerente (seg/min/h). |
| **Dados** | Marca, modelo e cor com autocomplete + "Outros"; tudo salvo como string no banco. |

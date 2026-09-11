# Concord

Aplicação de comunicação por texto em tempo real, desenvolvida como o Projeto 1 da disciplina de Computação em Nuvem da Pontifícia Universidade Católica de Campinas (PUC-Campinas).

O sistema oferece uma experiência simplificada de comunicação entre usuários, com autenticação, histórico de mensagens e notificações em tempo real.

## Arquitetura

O projeto é organizado em cinco componentes principais:

| Componente | Responsabilidade | Tecnologia |
| --- | --- | --- |
| Proxy reverso e frontend | Ponto de entrada, distribuição da aplicação web e encaminhamento das requisições | Nginx, React, React Router |
| API | Autenticação, regras de negócio, persistência e publicação de mensagens | Java, Spring Boot, Spring Security, JWT |
| Banco de dados | Armazenamento de usuários, mensagens e histórico | MySQL |
| Broker de mensagens | Comunicação assíncrona entre a API e o gateway | Apache Kafka |
| Gateway realtime | Gerenciamento das conexões e entrega das notificações | Node.js, Socket.IO |

### Fluxo de mensagens

```text
Cliente
  │ HTTP/REST e WebSocket
  ▼
Proxy reverso (Nginx)
  ├── HTTP/REST ───────► API ─────► MySQL
  │                         │
  │                         └──────► Kafka
  │                                      │
  └── WebSocket ───────► Gateway ◄──────┘
                              │
                              └── Notificação em tempo real ao cliente
```

O cliente acessa o proxy pela porta `80`. A API utiliza HTTP na porta `3000` na arquitetura descrita no relatório e é executada na porta `8082` na configuração atual do projeto. O gateway utiliza WebSocket na porta `8081` na descrição arquitetural e porta `3000` na configuração atual.

## Organização do repositório

```text
.
├── frontend/              # Interface web React/React Router
├── webserver/             # API Java/Spring Boot
├── realtime-gateway/      # Gateway Socket.IO + consumidor Kafka
├── infra/                 # Docker Compose, Vagrant, Nginx e provisionamento
└── descritivo-projeto1.pdf
```

## Tecnologias

- React, React Router, TypeScript, Tailwind CSS e Socket.IO Client
- Java 21 e Spring Boot
- Spring Security e JWT
- Spring Data JPA e MySQL
- Apache Kafka
- Node.js e Socket.IO
- Nginx
- Docker Compose e Vagrant/VirtualBox

## Pré-requisitos

Para executar a stack conteinerizada:

- Docker com Docker Compose

Para executar a infraestrutura distribuída em máquinas virtuais:

- Vagrant
- VirtualBox
- Aproximadamente 6 GB de memória disponível para as VMs

## Execução com Docker Compose

1. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp infra/.env.example infra/.env
   ```

2. Ajuste as credenciais e os identificadores no arquivo `infra/.env`. Em especial, substitua `MYSQL_ROOT_PASSWORD`, `JWT_SECRET` e `KAFKA_CLUSTER_ID` por valores adequados.

3. Suba todos os serviços:

   ```bash
   docker compose --env-file infra/.env -f infra/docker-compose.yml up --build
   ```

4. Acesse a aplicação em [http://localhost](http://localhost). A porta publicada pode ser alterada pela variável `NGINX_PORT`.

Para interromper os serviços:

```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml down
```

Os dados do MySQL e do Kafka ficam em volumes Docker. Para removê-los junto com os containers, use `down -v` somente quando essa perda for desejada.

## Execução distribuída com Vagrant

O `infra/Vagrantfile` provisiona cinco máquinas virtuais:

| VM | Função | IP interno |
| --- | --- | --- |
| `proxy` | Nginx e frontend | `10.20.30.1` |
| `api` | API Spring Boot | `10.20.30.2` |
| `db` | MySQL | `10.20.30.3` |
| `broker` | Apache Kafka | `10.20.30.4` |
| `gateway` | Gateway Socket.IO | `10.20.30.5` |

O acesso ao proxy é encaminhado para a porta `8069` do host.

```bash
cd infra
cp .env.example .env
# edite .env, se necessário
vagrant up
```

Depois do provisionamento, acesse [http://localhost:8069](http://localhost:8069). Para consultar o estado das VMs:

```bash
vagrant status
```

Para desligá-las sem removê-las:

```bash
vagrant halt
```

## Endereçamento e portas

### Rede virtual interna

As VMs usam a rede `10.20.30.0/28`:

- Proxy: `10.20.30.1`
- API: `10.20.30.2`
- Banco: `10.20.30.3`
- Broker: `10.20.30.4`
- Gateway: `10.20.30.5`

Também existe uma rede host-only `192.168.56.0/24`, usada para SSH durante o desenvolvimento local:

- API: `192.168.56.102`
- Banco: `192.168.56.103`
- Broker: `192.168.56.104`
- Gateway: `192.168.56.105`

### Portas principais

| Origem | Destino | Protocolo | Porta |
| --- | --- | --- | --- |
| Cliente | Proxy | HTTP | `80` |
| Proxy | API | HTTP | `8082` |
| Proxy | Gateway | WebSocket | `3000` |
| API | MySQL | MySQL | `3306` |
| API/Gateway | Kafka | Kafka | `9092` |
| Host | VMs | SSH | `22` |

## Execução dos componentes separadamente

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Outros comandos úteis:

```bash
npm run typecheck
npm run build
npm run start
```

### API

```bash
cd webserver
./mvnw spring-boot:run
```

Para gerar o pacote:

```bash
./mvnw clean package
```

Variáveis relevantes: `SERVER_PORT`, `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `KAFKA_BOOTSTRAP_SERVERS` e `JWT_SECRET`.

### Gateway realtime

```bash
cd realtime-gateway
npm install
npm run dev
```

Para produção:

```bash
npm run build
npm run start
```

Variáveis relevantes: `PORT`, `KAFKA_CLIENT_ID` e `KAFKA_BROKERS`.

## Kafka

O tópico utilizado para publicação e consumo de mensagens é `my-topic`. Em ambientes Docker, ele é criado pelo serviço `kafka-init`.

O gateway consome as mensagens e as encaminha aos sockets associados ao usuário destinatário. Usuários desconectados não recebem a notificação em tempo real; o histórico permanece disponível por meio da API e do banco de dados.

## Testes

Os testes da API podem ser executados com:

```bash
cd webserver
./mvnw test
```

## Documentação complementar

O documento de requisitos e arquitetura que fundamenta este README está disponível em [`descritivo-projeto1.pdf`](./descritivo-projeto1.pdf).

## Autores

- Guilherme Enrique Oliveira de Andrade - 23012104
- Luigi Garutti Zanon - 23006999
- Mauricio Lima Bordon - 23010648

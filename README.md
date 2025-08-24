# Flash Sale System

A high-throughput flash sale system designed to handle massive spikes in traffic while ensuring fairness and no overselling.

---

## 🎯 Design Choice & Trade-offs

This system is designed with **high throughput, low latency, and fairness** in mind. Key design choices include:

| Component            | Choice                                  | Trade-offs                                                                                                                   |
| -------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Monorepo             | **Nx**                                  | Organizes API, web and scripts as separate apps/libs on a single repository. Trade-off: adds learning curve for new user.    |
| Web Framework        | **Fastify (Node.js)**                   | Extremely fast, lightweight. Trade-off: less built-in structure than NestJS.                                                 |
| Request Handling     | **Queue-based ordering via RabbitMQ**   | Ensures ordered processing and prevents DB overload. Trade-off: slight delay in processing as requests go through the queue. |
| Inventory Management | **Redis atomic decrement**              | Prevents overselling. Trade-off: requires syncing stock to DB asynchronously.                                                |
| Rate Limiting        | **User ID-based token bucket in Redis** | Fairness per user. Trade-off: requires distributed store and adds slight overhead.                                           |
| Caching              | **Redis**                               | Reduces database load and latency. Trade-off: must handle cache invalidation carefully.                                      |
| Workers              | **RabbitMQ consumers processing queue** | Horizontal scalability and resilience. Trade-off: must handle retries and failed message processing.                         |
| Package Manager      | **PNPM**                                | Disk space savings by using symlinks. Trade-off: some legacy tooling may expect `node_modules` layout of npm/yarn.           |

---

## 🖼️ System Diagram

![System Diagram](./files/system-design.svg)

---

## 🛠️ Run the Project

1. **Install dependencies**

```bash
pnpm install
```

2. **Run services**

```bash
docker-compose up -d
```

3. **Prepare env**

```bash
cd apps/api
cp .env.example .env
```

4. **Run database migration and seeding**

```bash
pnpm nx run api:migrate
pnpm nx run api:seed
pnpm nx run api:generate
```

5. **Run Backend and Frontend**

```bash
pnpm nx run-many --target=serve --projects=api,web
```

6. **Run Unit Tests**

```bash
pnpm nx run api:test
```

7. **_Run E2E Tests_**

```bash
pnpm nx e2e api-e2e
```

8. **_Prepare for Load/Stress Test_**

```bash
pip install locust
```

or

```bash
brew install locust
```

9. **Run Load/Stress Test**

```bash
cd loadtest
locust -f locustfile.py --host=http://localhost:3000
```

## Demo

![Demo Video](https://github.com/haristhohir/flash-sale/raw/refs/heads/docs/files/demo.mp4)

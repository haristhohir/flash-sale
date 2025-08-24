# Flash Sale System

A high-throughput flash sale system designed to handle massive spikes in traffic while ensuring fairness and no overselling.

---

## 🎯 Design Choice & Trade-offs

This system is designed with **high throughput, low latency, and fairness** in mind. Key design choices include:

| Component | Choice | Trade-offs |
|-----------|--------|------------|
| Web Framework | **Fastify (Node.js)** | Extremely fast, lightweight. Trade-off: less built-in structure than NestJS. |
| Request Handling | **Queue-based ordering via RabbitMQ** | Ensures ordered processing and prevents DB overload. Trade-off: slight delay in processing as requests go through the queue. |
| Inventory Management | **Redis atomic decrement** | Prevents overselling. Trade-off: requires syncing stock to DB asynchronously. |
| Rate Limiting | **User ID-based token bucket in Redis** | Fairness per user. Trade-off: requires distributed store and adds slight overhead. |
| Workers | **RabbitMQ consumers processing queued orders** | Horizontal scalability and resilience. Trade-off: must handle retries and failed message processing. |

---

## 🖼️ System Diagram

![System Diagram](./files/system-design.svg)


---

## 🛠️ Run the Project

1. **Install dependencies**
```bash
pnpm install
```

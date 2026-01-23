# 🏸 BadMintoz Architecture

```mermaid
graph TD
    User[User / Browser] -->|HTTPS| Gateway[API Gateway (8222)]
    
    subgraph "Docker Network"
        Gateway -->|/api/auth| Auth[Auth Service (8081)]
        Gateway -->|/api/courts| Court[Court Service (8082)]
        
        Auth -->|Read/Write| DB[(PostgreSQL)]
        Court -->|Read/Write| DB
        
        Eureka[Eureka Registry (8761)]
        Gateway -.->|Register| Eureka
        Auth -.->|Register| Eureka
        Court -.->|Register| Eureka
    end
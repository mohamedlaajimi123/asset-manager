# Asset Manager Backend

A robust NestJS backend API designed for cloud-based asset management. This service securely handles file uploads, organizes them into dynamic user folders via Prisma ORM, and integrates natively with Microsoft Azure cloud services.

## Features

- **Cloud File Storage** — Multi-mimetype file uploads streamed straight to Azure Blob Storage.
- **Dynamic Folder Architecture** — Automatically initializes a user `Root` folder upon first upload, with support for custom folder creation.
- **Official Azure SDK Mailer** — Dispatches transaction logs using the native `@azure/communication-email` long-running operational poller.
- **Secured Ephemeral URLs** — Generates time-restricted SAS tokens for secure, temporary public access to files.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (or your active database provider)

## Installation

1. Clone this repository to your local workspace.
2. Install the dependencies:

   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory of your project and populate it with your specific provider strings:

```env
# Database Context Configuration
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Azure Cloud Blob Storage Context
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=your_account;AccountKey=your_key;EndpointSuffix=core.windows.net"
AZURE_CONTAINER_NAME="your-blob-container-name"

# Azure Communication Native Service SDK Settings
AZURE_EMAIL_CONNECTION_STRING="endpoint=https://your-hub.communication.azure.com/;accesskey=your_primary_access_key"
EMAIL_FROM_ADDRESS="donotreply@your-verified-subdomain.azurecomm.net"
```

## Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```
## Running with Docker (Recommended)

This project is fully containerized with Docker and Docker Compose, allowing you to spin up the NestJS API and the PostgreSQL database simultaneously with zero manual local configuration.

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Quick Start
1. Ensure your `.env` file is configured (make sure `DATABASE_URL` points to `postgres` as the host inside the Docker network).
2. Run the following command in your root directory:

```bash
docker compose up --build
```

## License

This project is licensed under the MIT License.

FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Clean install all dependencies (more flexible than npm ci)
RUN npm install

# Copy your Prisma schema folder and generate the client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of your local app source files
COPY . .

# Build the NestJS production dist folder
RUN npm run build

EXPOSE 3000

# Execute the compiled NestJS main entrypoint
CMD ["node", "dist/main"]
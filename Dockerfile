FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package info and prisma schema first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy all other source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Start production image build
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the application port
EXPOSE 3000

# Run prisma migrations and start the application
CMD [ "sh", "-c", "npx prisma migrate deploy && npm run start:prod" ]

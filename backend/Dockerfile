FROM node:20-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install dependencies first (use npm cache in /tmp to avoid build-host locks)
COPY package.json package-lock.json* ./
RUN npm config set cache /tmp/.npm-cache --global && npm ci --omit=dev --no-audit --prefer-offline

# Copy source
COPY . .

EXPOSE 3000

# Run database sync then start the server
CMD ["sh", "-c", "node src/utils/syncDatabase.js && node src/server.js"]

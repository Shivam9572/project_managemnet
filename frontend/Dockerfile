FROM node:20-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install dependencies using /tmp cache to avoid host locks
COPY package.json package-lock.json* ./
RUN npm config set cache /tmp/.npm-cache --global && npm ci --omit=dev --no-audit --prefer-offline

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

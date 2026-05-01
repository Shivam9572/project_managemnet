FROM node:20-slim

WORKDIR /usr/src/app

# Use development env for install/build so devDependencies (tailwind, etc.) are available
ENV NODE_ENV=development

# Install dependencies using /tmp cache to avoid host locks
COPY package.json package-lock.json* ./
RUN npm config set cache /tmp/.npm-cache --global && npm ci --no-audit --prefer-offline

# Copy source and build
COPY . .
RUN npm run build

# Set production env for runtime
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]

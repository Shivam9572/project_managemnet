FROM node:20-slim

WORKDIR /usr/src/app

# ✅ Sirf production - Next.js build aur runtime dono ke liye
ENV NODE_ENV=production

COPY package.json package-lock.json* ./

# ✅ devDependencies ke liye --include=dev use karo NODE_ENV=development ki jagah
RUN npm config set cache /tmp/.npm-cache --global && npm ci --no-audit --prefer-offline --include=dev

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
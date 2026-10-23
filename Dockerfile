FROM node:22.19.0-alpine

WORKDIR /app

# Install dependencies first so this layer is cached between code changes
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV PORT=8080
EXPOSE 8080

USER node

CMD ["node", "app.js"]

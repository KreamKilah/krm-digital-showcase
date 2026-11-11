# Isolated application image. No credentials or demo data baked in.
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund --ignore-scripts && npm cache clean --force
COPY src/ ./src/
COPY public/ ./public/
COPY scripts/ ./scripts/
COPY sql/ ./sql/
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node","src/server.mjs"]

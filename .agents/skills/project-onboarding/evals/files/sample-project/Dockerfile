FROM node:22-alpine AS runner
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
CMD ["node", "server.js"]

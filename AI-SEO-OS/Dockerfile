FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm i --frozen-lockfile || pnpm i
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm","start"]

# -------------------------------------------------------
# First stage: Install dependencies only when needed
# -------------------------------------------------------
FROM node:22-alpine AS dependencies
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# -------------------------------------------------------
# Second stage: Build the application
# -------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# TypeScript -> dist/ (Javascript)
RUN yarn build

RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# -------------------------------------------------------
# Third Stage: Production Runner
# -------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Security Standart: Use node user
USER node

COPY --chown=node:node pacakge*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
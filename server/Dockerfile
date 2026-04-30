FROM node:18-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]

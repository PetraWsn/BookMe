FROM node:20-alpine

WORKDIR /app

RUN npm ci --silent

COPY package*.json ./
RUN npm install

COPY . .

RUN apk update && apk upgrade

EXPOSE 3000
CMD ["node", "index.js"]
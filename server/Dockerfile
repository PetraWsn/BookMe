FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent
RUN npm install

COPY . .

RUN apk update && apk upgrade

EXPOSE 5000
CMD ["node", "index.js"]
FROM node:20-alpine3.25

WORKDIR /app

RUN apk update && apk upgrade

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
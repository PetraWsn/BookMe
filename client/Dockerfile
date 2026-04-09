FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npx", "serve", "-s", "build", "-l", "3001"]git
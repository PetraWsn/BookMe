FROM node:20-alpine

WORKDIR /app

# Vi behöver inte apk update/upgrade varje gång om vi inte har specifika behov
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Kontrollera om din mapp heter 'dist' (standard för Vite) eller 'build'
# Jag sätter porten till 5173 och lyssnar på alla adresser (0.0.0.0)
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
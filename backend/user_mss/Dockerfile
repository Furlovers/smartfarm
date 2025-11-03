FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source

COPY . .

CMD ["node", "src/server.js"]

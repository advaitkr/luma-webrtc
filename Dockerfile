FROM node:16

WORKDIR ../docker-node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
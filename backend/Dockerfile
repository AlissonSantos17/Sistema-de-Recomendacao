FROM node:20-alpine

WORKDIR /usr/src/app/backend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
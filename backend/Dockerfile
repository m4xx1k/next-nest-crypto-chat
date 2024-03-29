FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npx prisma db push

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
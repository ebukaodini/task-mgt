# pull base image
FROM node:17-alpine3.12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./

RUN npm set timeout=100000

RUN npm install

COPY . /app

EXPOSE 3000

EXPOSE 5432

CMD [ "npm", "run", "start:docker" ]
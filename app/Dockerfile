FROM node:alpine

WORKDIR /server

COPY package.json ./
COPY package-lock.json ./

RUN npm install -g mysql2
RUN npm install -g sequelize
RUN npm install -g sequelize-cli
RUN npm install \
    && mv node_modules /node_modules

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]
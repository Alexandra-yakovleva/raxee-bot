FROM node:14

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

CMD [ "npm", "start" ]

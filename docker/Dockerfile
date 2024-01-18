FROM node:20-alpine as build

WORKDIR /app

COPY . .

# Install PM2
RUN npm install -g pm2

RUN npm i -g @nestjs/cli
RUN npm ci --omit=dev --ignore-scripts
RUN npm run build

# clear application caching
RUN npm cache clean --force

RUN ls dist/microservices/api/src -al
# RUN ls dist/microservices/consumers/src -al

CMD [ "npm", "run", "start" ]
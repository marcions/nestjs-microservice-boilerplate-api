FROM node:14

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/users-api

COPY apps/users-api/package.json dist/apps/users-api/
COPY apps/users-api/tsconfig.build.json dist/apps/users-api/
COPY apps/users-api/tsconfig.json dist/apps/users-api/

EXPOSE 4000

RUN yarn --cwd dist/apps/users-api
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/users-api -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:users-api:prd

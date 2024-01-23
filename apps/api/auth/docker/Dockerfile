FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/users

COPY api/users/package.json dist/api/users/
COPY api/users/tsconfig.build.json dist/api/users/
COPY api/users/tsconfig.json dist/api/users/

EXPOSE 3101

RUN yarn --cwd dist/api/users
RUN yarn --cwd dist/apps/libs/auth
RUN yarn --cwd dist/apps/libs/core
RUN yarn --cwd dist/apps/libs/infra
RUN yarn --cwd dist/apps/libs/utils

RUN ls dist/api/users -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:users:prd

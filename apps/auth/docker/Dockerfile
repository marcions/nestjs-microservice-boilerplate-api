FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/users

COPY apps/users/package.json dist/apps/users/
COPY apps/users/tsconfig.build.json dist/apps/users/
COPY apps/users/tsconfig.json dist/apps/users/

EXPOSE 3101

RUN yarn --cwd dist/apps/users
RUN yarn --cwd dist/apps/libs/auth
RUN yarn --cwd dist/apps/libs/core
RUN yarn --cwd dist/apps/libs/infra
RUN yarn --cwd dist/apps/libs/utils

RUN ls dist/apps/users -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:users:prd

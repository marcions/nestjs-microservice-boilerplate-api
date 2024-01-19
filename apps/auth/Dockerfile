FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/auth

COPY apps/auth/package.json dist/apps/auth/
COPY apps/auth/tsconfig.build.json dist/apps/auth/
COPY apps/auth/tsconfig.json dist/apps/auth/

EXPOSE 3100

RUN yarn --cwd dist/apps/auth
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/auth -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:auth:prd
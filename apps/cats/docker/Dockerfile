FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/cats

COPY apps/cats/package.json dist/apps/cats/
COPY apps/cats/tsconfig.build.json dist/apps/cats/
COPY apps/cats/tsconfig.json dist/apps/cats/

EXPOSE 3101

RUN yarn --cwd dist/apps/cats
RUN yarn --cwd dist/apps/libs/auth
RUN yarn --cwd dist/apps/libs/core
RUN yarn --cwd dist/apps/libs/infra
RUN yarn --cwd dist/apps/libs/utils

RUN ls dist/apps/cats -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:cats:prd

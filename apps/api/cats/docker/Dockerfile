FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/cats

COPY api/cats/package.json dist/api/cats/
COPY api/cats/tsconfig.build.json dist/api/cats/
COPY api/cats/tsconfig.json dist/api/cats/

EXPOSE 3101

RUN yarn --cwd dist/api/cats
RUN yarn --cwd dist/apps/libs/auth
RUN yarn --cwd dist/apps/libs/core
RUN yarn --cwd dist/apps/libs/infra
RUN yarn --cwd dist/apps/libs/utils

RUN ls dist/api/cats -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:cats:prd

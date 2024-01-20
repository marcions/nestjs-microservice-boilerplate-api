FROM node:14

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/dogs-api

COPY apps/dogs-api/package.json dist/apps/dogs-api/
COPY apps/dogs-api/tsconfig.build.json dist/apps/dogs-api/
COPY apps/dogs-api/tsconfig.json dist/apps/dogs-api/

EXPOSE 4000

RUN yarn --cwd dist/apps/dogs-api
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/dogs-api -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:dogs-api:prd

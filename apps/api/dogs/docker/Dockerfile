FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @api/dogs

COPY api/dogs/package.json dist/api/dogs/
COPY api/dogs/tsconfig.build.json dist/api/dogs/
COPY api/dogs/tsconfig.json dist/api/dogs/

EXPOSE 3101

RUN yarn --cwd dist/api/dogs
RUN yarn --cwd dist/apps/libs/auth
RUN yarn --cwd dist/apps/libs/core
RUN yarn --cwd dist/apps/libs/infra
RUN yarn --cwd dist/apps/libs/utils

RUN ls dist/api/dogs -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:dogs:prd

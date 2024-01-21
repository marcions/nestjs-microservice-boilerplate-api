FROM node:20

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/users

COPY apps/users/package.json dist/apps/users/
COPY apps/users/tsconfig.build.json dist/apps/users/
COPY apps/users/tsconfig.json dist/apps/users/

EXPOSE 4000

RUN yarn --cwd dist/apps/users
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/users -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:users:prd

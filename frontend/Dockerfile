# Dockerfile

# base image
FROM node:14.18-alpine

# create & set working directory
RUN mkdir -p /usr/src/devmenager/frontend
WORKDIR /usr/src/devmenager/frontend

# copy source files
COPY . /usr/src/devmenager/frontend

# install dependencies
RUN npm install
# RUN npm i @next/swc-linux-x64-gnu

# start app
RUN npm run build
EXPOSE 3000
CMD npm run start

# Dockerfile

# base image
FROM node:14.18-alpine

# create & set working directory
RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend

# copy source files
COPY . /usr/src/backend

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3001
CMD npm run start

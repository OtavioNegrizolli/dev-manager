# Dockerfile

# base image
FROM node:14.18-alpine

# create & set working directory
RUN mkdir -p /usr/src/front
WORKDIR /usr/src/front

# copy source files
COPY . /usr/src/front

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3000
CMD npm run start

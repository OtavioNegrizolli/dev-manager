# Dockerfile
# base image
FROM node:14.18-alpine

# create & set working directory
RUN mkdir -p /usr/backend
WORKDIR /usr/backend

# install dependencies
RUN npm install

# copy source files
COPY . /usr/backend

# start app
RUN npm run build
EXPOSE 3001
CMD npm run start

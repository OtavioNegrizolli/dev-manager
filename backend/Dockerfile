# Dockerfile
# base image
FROM node:14.18-alpine

# create & set working directory
RUN mkdir -p /usr/src/devmenager/backend
WORKDIR /usr/src/devmenager/backend

# copy source files
COPY . /usr/src/devmenager/backend

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3001
CMD npm run start

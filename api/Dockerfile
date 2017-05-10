FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN rm -rf node_modules
RUN npm install
#RUN npm i -g nodemon

# Bundle app source
COPY . /app

ENV PORT 80
EXPOSE 80

CMD ["npm", "run", "start:server"]

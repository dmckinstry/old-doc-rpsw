FROM node:8.11.3-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]

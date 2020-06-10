FROM node:12.4.0-alpine

# Create app directory
RUN mkdir -p /usr/client-side
WORKDIR /usr/client-side

# Install dependencies
COPY ./package.json .
RUN npm install

# Bundle app source
COPY src ./src
COPY angular.json .
COPY package.json .
COPY tsconfig.json .

# Exports
EXPOSE 4200

## Getting the wait script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start
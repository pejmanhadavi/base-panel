FROM node:12
RUN mkdir -p /home/dev/store-back
WORKDIR /home/dev/store-back
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
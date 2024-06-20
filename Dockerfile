FROM node:21-alpine3.18 as build
WORKDIR /work
COPY package.json ./
COPY yarn.lock ./
# RUN npm install -g pnpm
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
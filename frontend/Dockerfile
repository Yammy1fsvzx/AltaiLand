FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=false
RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"] 
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production=false

# libs 디렉토리 복사
COPY libs/ ./libs/

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["node", "dist/event/src/main.js"]

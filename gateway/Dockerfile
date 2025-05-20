FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production=false

# 모든 소스 코드 복사
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]

FROM node:18-alpine

WORKDIR /app

# 프로젝트 루트에서 auth 디렉토리의 package.json 복사
COPY auth/package*.json ./

RUN npm install --production=false

# auth 디렉토리의 모든 파일 복사
COPY auth/ .

# libs 디렉토리 복사
COPY libs/ ./libs/

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]

FROM node:20

WORKDIR /app

COPY package.json package-lock.json* tsconfig.json ./
COPY prisma ./prisma
COPY data ./data
RUN npm ci

COPY .env .env 
RUN npx prisma generate

COPY src ./src

COPY tests ./tests
COPY jest.config.cjs ./

RUN npm run build

RUN ls -lh dist

EXPOSE 5001

CMD sh -c "npm run migrate:deploy && npm run dev"
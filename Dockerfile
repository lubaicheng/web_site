FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . .

RUN npx prisma generate
RUN npx prisma db push 2>/dev/null; npx prisma db seed 2>/dev/null; echo "done"

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss 2>/dev/null && npx prisma db seed 2>/dev/null && npm run dev"]

# 1. Use official Node.js image
FROM node:18

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json (if present)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your app
COPY . .

# 6. Expose the port your app uses
EXPOSE 3000

# 7. Start the app
CMD ["node", "server.js"]

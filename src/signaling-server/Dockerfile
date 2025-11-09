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
COPY ../shared ./shared
# 6. Expose the port your app uses
EXPOSE 8181

# 7. Start the app
CMD ["node", "server.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --insecure --fail https://localhost:8181/ || exit 1
# 1. Use Node.js (Alpine is a lightweight version)
FROM node:20-alpine

# 2. Set the folder inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Open the port
EXPOSE 5173

# 6. Start the server
CMD ["npm", "run", "dev", "--", "--host"]
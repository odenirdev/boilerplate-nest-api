FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 8080

# Use development mode with hot reload
CMD ["sh", "-c", "npx prisma generate && yarn start:dev"]

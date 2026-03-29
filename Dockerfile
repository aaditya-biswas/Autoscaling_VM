
# Take Node 
FROM node:18

# SET WORKING DIR

WORKDIR /app 

# COPY PACKAGE FILES FIRST (for caching)

COPY package*.json ./


# Install Dependencies
RUN npm install

# Copy rest of the files 
COPY . .

# Expose PORT 
EXPOSE 3000

# start app 
CMD ["npm", "run", "start"]




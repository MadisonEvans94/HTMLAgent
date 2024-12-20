# Use an official Nginx image
FROM nginx:alpine

# Set the working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Remove the default Nginx index page
RUN rm -rf ./*

# Copy the Vite build output to the working directory
COPY dist/ .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

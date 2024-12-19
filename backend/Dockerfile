# Start from a lightweight Python 3.11 base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Run the server by default when the container starts
# If you've updated the uvicorn.run line to "main:app",
# this command will work as expected
CMD ["python", "main.py"]

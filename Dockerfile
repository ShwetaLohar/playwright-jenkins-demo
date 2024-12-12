# FROM mcr.microsoft.com/playwright:v1.49.1-noble
# RUN apt-get update && apt-get install -y ffmpeg

# docker build -t playwright-with-ffmpeg


# FROM mcr.microsoft.com/playwright:v1.49.1-noble

# # Install ffmpeg
# RUN apt-get update && apt-get install -y ffmpeg

# # Build the Docker image
# docker build -t playwright-with-ffmpeg .


# FROM mcr.microsoft.com/playwright:v1.49.1-noble

# # Install ffmpeg
# RUN apt-get update && apt-get install -y ffmpeg

# # Build the Docker image
# docker build -t playwright-with-ffmpeg .



FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Optionally clean up apt cache to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose necessary ports
EXPOSE 3000

# Set environment variables
ENV VIDEO_DIR=/myVideos

# Set timezone
ENV TZ=Asia/Kolkata

# Commands to run (e.g., testing, dependencies installation) can be added below

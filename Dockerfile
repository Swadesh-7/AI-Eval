# AI-VivaEval: Production Container for Cloud Deployment (Render / Hugging Face Spaces)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY backend /app/backend
COPY frontend /app/frontend

# Expose port (Hugging Face Spaces uses 7860, Render uses PORT)
EXPOSE 7860

# Run FastAPI app via Uvicorn
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}"]

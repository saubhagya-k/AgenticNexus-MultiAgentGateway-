# ai-service/Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV GEMINI_API_KEY=your_key_here   
# Better: pass via .env or Docker secrets
CMD ["python", "ai_service.py"]
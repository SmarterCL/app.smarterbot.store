FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml ./pyproject.toml
RUN pip install --no-cache-dir fastapi==0.111.0 uvicorn==0.30.0 httpx==0.27.0 pydantic==2.6.4 python-dotenv==1.0.1
COPY src ./src
ENV PYTHONPATH=/app/src
CMD ["uvicorn", "router.main:app", "--host", "0.0.0.0", "--port", "8000"]

# gateway/main.py

import os
import grpc
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import chat_pb2
import chat_pb2_grpc

# ---------- FastAPI app ----------
app = FastAPI(title="Chat Gateway")

# ---------- Request/Response Models ----------
class ChatRequest(BaseModel):
    message: str
    user_id: str   # or we can use a JWT, but for simplicity we pass user_id

class ChatResponse(BaseModel):
    response: str

# ---------- gRPC client ----------
# The AI service address (set via environment variable)
AI_SERVICE_HOST = os.getenv("AI_SERVICE_HOST", "localhost")
AI_SERVICE_PORT = os.getenv("AI_SERVICE_PORT", "50051")
GRPC_CHANNEL = grpc.insecure_channel(f"{AI_SERVICE_HOST}:{AI_SERVICE_PORT}")
AI_STUB = chat_pb2_grpc.AIServiceStub(GRPC_CHANNEL)

# ---------- Endpoint ----------
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Map user_id to thread_id (for now, we just use user_id directly)
    thread_id = request.user_id

    # Call the AI microservice via gRPC
    try:
        grpc_request = chat_pb2.ChatRequest(
            message=request.message,
            thread_id=thread_id
        )
        grpc_response = AI_STUB.Chat(grpc_request)
        return ChatResponse(response=grpc_response.response)
    except grpc.RpcError as e:
        raise HTTPException(status_code=503, detail=f"gRPC error: {e.details()}")

# Optional root
@app.get("/")
def root():
    return {"message": "Gateway is running"}
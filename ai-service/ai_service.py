# ai_service.py

import grpc
from concurrent import futures
import chat_pb2
import chat_pb2_grpc
from chat_engine import get_ai_response

class AIServicer(chat_pb2_grpc.AIServiceServicer):
    def Chat(self, request, context):
        # Call our core function
        reply_text = get_ai_response(request.message, request.thread_id)
        return chat_pb2.ChatReply(response=reply_text)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chat_pb2_grpc.add_AIServiceServicer_to_server(AIServicer(), server)
    server.add_insecure_port('[::]:50051')
    print("gRPC AI Service running on port 50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()



# server is active engine

# this is second one ok na , i will erase it tomarrow
# today is tomarrow 
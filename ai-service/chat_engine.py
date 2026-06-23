import os
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages

# Load environment variables (GOOGLE_API_KEY must be set)
load_dotenv()

# 1. Initialize the Gemini model
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

# 2. Define the state TypedDict
class BotAiState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

# 3. Node function: takes state, calls LLM, returns new messages
def chat_node(state: BotAiState):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}

# 4. Build and compile the graph with MemorySaver
graph = StateGraph(BotAiState)
graph.add_node("chat_node", chat_node)
graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)

checkpointer = MemorySaver()
workflow = graph.compile(checkpointer=checkpointer)

# 5. Public function to be used by the service
def get_ai_response(user_message: str, thread_id: str) -> str:
    """
    Send a user message and get the AI's reply.
    The thread_id is used to keep conversation history separate per user/session.
    """
    config = {"configurable": {"thread_id": thread_id}}
    response = workflow.invoke(
        {"messages": [HumanMessage(content=user_message)]},
        config=config
    )
    return response["messages"][-1].content
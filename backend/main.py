from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from langchain.schema import HumanMessage

from agent_resources.agents.html_agent.html_agent import AgentOutput
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from agent_resources.agent_factory import AgentFactory
import uvicorn
from dotenv import load_dotenv
load_dotenv()
class UserRequest(BaseModel):
    message: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan function to set up resources before the app starts handling requests
    and clean up after the app shuts down.
    """
    # Initialize resources
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    memory = MemorySaver()
    agent_factory = AgentFactory(llm=llm, memory=memory)
    app.state.agent = agent_factory.factory("html_agent")

    # Yield control to start the application
    yield

    # Cleanup resources (if necessary)
    del app.state.agent

# Create FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)


@app.post("/chat", response_model=AgentOutput)
async def chat_endpoint(user_request: UserRequest):
    """
    Endpoint to handle chat requests. Accepts a JSON payload with the user's message
    and returns a structured response from the agent.
    """
    try:
        # Retrieve the agent from app state
        agent = app.state.agent
        # Run the agent with user's input message
        result = agent.run(HumanMessage(content=user_request.message))
        return result  # Pydantic model returns JSON with keys AIResponse and HTMLString
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error processing your request.")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

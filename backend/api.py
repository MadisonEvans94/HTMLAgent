import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn  # Import uvicorn to run the server

from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from langgraph.checkpoint.memory import MemorySaver

from agent_resources.agent_factory import AgentFactory

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")


class UserRequest(BaseModel):
    message: str


class AgentResponse(BaseModel):
    response: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup code runs before the app starts serving requests

    llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo")
    memory = MemorySaver()
    agent_factory = AgentFactory(llm=llm, memory=memory)
    default_agent_type = "html_agent"
    try:
        app.state.agent = agent_factory.factory(default_agent_type)
        logger.info(f"Instantiated agent: {default_agent_type}")
    except Exception as e:
        logger.error(
            f"Failed to instantiate agent '{default_agent_type}': {e}", exc_info=True)
        raise RuntimeError(
            f"Could not instantiate agent '{default_agent_type}'.")
    yield
    logger.info("Application shutdown. Resources cleaned up.")


app = FastAPI(lifespan=lifespan)


@app.post("/chat", response_model=AgentResponse)
async def chat_endpoint(user_request: UserRequest):
    """
    Endpoint to interact with the agent.
    Expects a JSON payload with a 'message' field.
    Returns the agent's response.
    """
    try:
        # Retrieve the agent from application state
        agent = app.state.agent

        # Run the agent with user's message
        ai_message = agent.run(HumanMessage(content=user_request.message))

        # Return the agent's response as JSON
        return AgentResponse(response=ai_message.content)
    except Exception as e:
        logger.error("Error generating response", exc_info=True)
        raise HTTPException(
            status_code=500, detail="Error processing your request.")


if __name__ == "__main__":
    # Run the FastAPI app using uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

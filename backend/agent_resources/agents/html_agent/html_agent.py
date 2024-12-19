import logging
import json
from typing import Optional
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.prebuilt import create_react_agent
from agent_resources.base_agent import Agent


logger = logging.getLogger(__name__)


class AgentOutput(BaseModel):
    AIResponse: str
    HTMLString: Optional[str] = None


class HTMLAgent(Agent):
    """
    LangGraph-based HTML agent implementation for returning structured JSON.
    """

    def __init__(self, llm, memory):
        # Updated instructions to use AIResponse and HTMLString keys
        self.system_message = """
        [System]
        You are a helpful assistant. Always return your final answer as a JSON object with the keys "AIResponse" and "HTMLString". 
        - "AIResponse": a textual explanation or conversation response.
        - "HTMLString": a string containing HTML if the user requests a styled HTML snippet, or null if no HTML is requested.

        Example for normal request:
        {
          "AIResponse": "Hello! How can I help you?",
          "HTMLString": null
        }

        Example for HTML request:
        {
          "AIResponse": "Here is the requested HTML snippet.",
          "HTMLString": "<div class='w-screen h-1/2 flex items-center justify-center border-black border rounded'>Content here</div>"
        }
        """
        self.tools = []
        self.llm = llm
        self.memory = memory
        self.agent = self.compile_graph()

    def compile_graph(self):
        agent = create_react_agent(
            self.llm,
            tools=self.tools,
            state_modifier=self.system_message,
            checkpointer=self.memory,
        )
        return agent

    def run(self, message: HumanMessage) -> AgentOutput:
        """
        Process a HumanMessage and return an AgentOutput model containing 'AIResponse' and 'HTMLString'.

        The model's final response should be a JSON string. We parse it, validate it with Pydantic,
        and return the structured result.
        """
        try:
            thread_id = "default"
            config = {"configurable": {"thread_id": thread_id}}
            response = self.agent.invoke(
                {"messages": [message]}, config=config)

            # Final AI message
            ai_message = response["messages"][-1]
            if isinstance(ai_message, AIMessage):
                # The AIMessage content should be a JSON string according to the system instructions
                content = ai_message.content.strip()
                # Parse JSON
                data = json.loads(content)
                # Validate with Pydantic
                validated_data = AgentOutput(**data)
                return validated_data
            else:
                logger.error("Unexpected message type in response.")
                return AgentOutput(AIResponse="Sorry, I encountered an unexpected response format.", HTMLString=None)

        except Exception as e:
            logger.error("Error generating response", exc_info=True)
            return AgentOutput(AIResponse="Sorry, encountered an error while processing your request.", HTMLString=None)

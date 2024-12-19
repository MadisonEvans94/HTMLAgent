import logging
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.prebuilt import create_react_agent
from agent_resources.tools.tool_registry import ToolRegistry
from agent_resources.base_agent import Agent


# Initialize a logger specific to this module
logger = logging.getLogger(__name__)


class HTMLAgent(Agent):
    """
    LangGraph-based HTML agent implementation with MemorySaver for persistence.
    """

    def __init__(self, llm, memory):
        self.system_message = """
        [System]
        You are a helpful assistant. Always return your final answer as a JSON object with the keys "ai_message" and "html". 
        - "ai_message" should be a textual explanation or conversation response. 
        - "html" should be a string containing HTML if the user requests a styled HTML snippet, or null if no HTML is requested.

        Example for normal request:
        {
          "ai_message": "Hello! How can I help you?",
          "html": null
        }

        Example for HTML request:
        {
          "ai_message": "Here is the requested HTML snippet.",
          "html": "<div class='w-screen h-1/2 flex items-center justify-center border-black border rounded'>Content here</div>"
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

    def run(self, message: HumanMessage) -> AIMessage:
        """
        Process a HumanMessage and return an AIMessage.
        If a tool is invoked (HTML requested), return the HTML payload as the .content of the AIMessage.
        Otherwise, just return the final AIMessage from the LLM.
        """
        try:
            thread_id = "default"
            config = {"configurable": {"thread_id": thread_id}}
            response = self.agent.invoke(
                {"messages": [message]}, config=config)

            # Check if a tool was invoked
            tool_calls = response.get("tool_calls", [])
            if tool_calls:
                # It's an HTML response
                tool_result = tool_calls[-1]["result"]
                # tool_result is a dict like {"type": "html_response", "content": "<div>...</div>"}
                return AIMessage(content=tool_result["content"])

            # No tool call, normal conversation
            ai_message = response["messages"][-1]
            if isinstance(ai_message, AIMessage):
                return ai_message
            else:
                logger.error("Unexpected message type in response.")
                return AIMessage(content="Sorry, I encountered an unexpected response format.")

        except Exception as e:
            logger.error("Error generating response", exc_info=True)
            return AIMessage(content="Sorry, encountered an error while processing your request.")

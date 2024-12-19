from langchain.tools import BaseTool


class HTMLTool(BaseTool):
    """
    A tool that takes an HTML string as input and packages it into a payload 
    suitable for sending back to the client.
    """

    name: str = "html_tool"
    description: str = (
        "Takes raw HTML and returns a structured payload containing the HTML. "
        "Useful for sending rendered content back to the client."
    )

    def _run(self, html_str: str) -> dict:
        """
        Package the given HTML string into a payload dictionary that can be returned to the client.

        :param html_str: A string containing HTML content.
        :return: A dictionary representing the payload, which includes the HTML content.
        """
        payload = {
            "type": "html_response",
            "content": html_str
        }
        return payload

    async def _arun(self, html_str: str) -> dict:
        """
        Asynchronous version of the HTML packaging tool.
        """
        return self._run(html_str)

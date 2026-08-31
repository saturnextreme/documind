from google import genai
import os

class GenerateResponse:
    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )
        self.model = "gemini-3-flash-preview"

    def print_response(self, context):
        return self.client.models.generate_content(
            model=self.model,
            contents=context
        ).text
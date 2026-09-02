from google import genai
from fastapi import HTTPException

from config import settings


class GenerateResponse:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )
        self.model = "gemini-3-flash-preview"

    def print_response(self, context):
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=context
            )

            return response.text

        except Exception as e:
            error_message = str(e)

            # Gemini quota / rate limit
            if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
                raise HTTPException(
                    status_code=429,
                    detail="AI service quota exceeded. Please try again later."
                )

            # Other Gemini/API errors
            raise HTTPException(
                status_code=500,
                detail="Failed to generate an AI response. Please try again."
            )
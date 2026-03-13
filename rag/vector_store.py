from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class VectorStore:
    def __init__(self, dimension, session_id):
        self.dimension = dimension
        self.session_id = session_id

    def add(self, embeddings, texts, metadata_list):
        # Convert to list and batch insert
        rows = []

        for embedding, text, metadata in zip(embeddings, texts, metadata_list):
            rows.append({
                "content": text,
                "metadata": metadata,
                "session_id": self.session_id,
                "embedding": embedding.tolist()
            })

        response = supabase.table("documents").insert(rows).execute()

        if response.data is None:
            raise Exception(f"Insertion failed: {response}")

    def search(self, query_embedding, k=3):
        response = supabase.rpc(
            "match_documents",
            {
                "query_embedding": query_embedding.tolist(),
                "match_count": k,
                "session_filter": self.session_id
            }
        ).execute()

        if not response.data:
            return []

        return [
            {
                "text": item["content"],
                "metadata": item["metadata"]
            }
            for item in response.data
        ]

    def clear(self):
        supabase.table("documents") \
            .delete() \
            .eq("session_id", self.session_id) \
            .execute()

        print("Session data cleared.")
    
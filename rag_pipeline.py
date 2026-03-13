from rag.document_loader import DocumentLoader, TextSplitter
from rag.embedder import Embedder
from rag.vector_store import VectorStore
from rag.generate_response import GenerateResponse
import uuid
from dotenv import load_dotenv

load_dotenv()

class RAGPipeline:
    def __init__(self, pdf_paths):
        self.session_id = str(uuid.uuid4())
        self.loader = DocumentLoader(pdf_paths)
        self.splitter = TextSplitter()
        self.embedder = Embedder()
        self.vector_store = None
        self.generator = GenerateResponse()
        self.processed_chunks = []

    def build_index(self):
        data  = self.loader.load()
        self.processed_chunks = self.splitter.split(data)

        texts = [chunk["text"] for chunk in self.processed_chunks]
        metadata_list = [chunk["metadata"] for chunk in self.processed_chunks]
        
        embeddings = self.embedder.embed(texts)

        dimension = embeddings.shape[1]
        self.vector_store = VectorStore(dimension, self.session_id)
        self.vector_store.add(embeddings, texts, metadata_list)

    def query(self, question, k=3):
        query_embedding = self.embedder.embed(question)
        retrieved_chunks = self.vector_store.search(query_embedding, k)

        return self.build_prompt(question, retrieved_chunks)

    def build_prompt(self, question, contexts):
        context_text = ""
        for chunk in contexts:
            md = chunk["metadata"]
            context_text += f"(File: {md['file_name']}, Page: {md['page_number']})\n"
            context_text += chunk["text"] + "\n\n"

        prompt = f"""
            Answer only using the context below and give citation for that answer.

            Context:
            {context_text}

            Question:
            {question}

            Answer:
        """
        return prompt

    def generate(self, prompt):
        return self.generator.print_response(prompt)

if __name__ == "__main__":
    rag = RAGPipeline(pdf_paths=["word_representation.pdf", "document.pdf"])
    rag.build_index()
    
    print("\n\nAsk Rag Questions\n\n")
    x = input()
    i=0
    while x != "False":
        print(f"{i+1}. {x}")
        response_prompt = rag.query(x, k=7)
        result = rag.generate(response_prompt)
        print(result, end="\n\n\n")
        x = input()
        i+=1

    if rag.vector_store:
        rag.vector_store.clear()

    print("Session ended. Database cleaned.")

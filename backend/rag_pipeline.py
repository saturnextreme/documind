from rag.document_loader import DocumentLoader, TextSplitter
from rag.embedder import Embedder


class RAGPipeline:

    def __init__(self, pdf_documents):

        self.loader = DocumentLoader(
            pdf_documents
        )
        self.splitter = TextSplitter()
        self.embedder = Embedder()
        self.processed_chunks = []
        self.embeddings = None

    def build_index(self):

        # -----------------------------
        # 1. Load PDFs
        # -----------------------------

        data = self.loader.load()

        # -----------------------------
        # 2. Split into chunks
        # -----------------------------

        self.processed_chunks = (
            self.splitter.split(data)
        )

        if not self.processed_chunks:

            raise ValueError(
                "No text chunks were generated "
                "from the PDFs"
            )

        # -----------------------------
        # 3. Extract text
        # -----------------------------

        texts = [
            chunk["text"]
            for chunk in self.processed_chunks
        ]

        # -----------------------------
        # 4. Generate embeddings
        # -----------------------------

        self.embeddings = (
            self.embedder.embed(texts)
        )

        # -----------------------------
        # 5. Return chunks + embeddings
        # -----------------------------

        return (
            self.processed_chunks,
            self.embeddings
        )
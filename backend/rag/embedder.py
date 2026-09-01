import numpy as np
from fastembed import TextEmbedding


class Embedder:

    def __init__(
        self,
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    ):
        self.model_name = model_name
        self.model = TextEmbedding(
            model_name=self.model_name
        )

    def embed(self, chunks):

        if not chunks:
            return np.empty(
                (0, 384),
                dtype=np.float32
            )

        embeddings = list(
            self.model.embed(
                chunks,
                batch_size=32
            )
        )

        return np.array(
            embeddings,
            dtype=np.float32
        )
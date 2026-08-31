from pypdf import PdfReader
import re
import os

class DocumentLoader:
    def __init__(self, paths: list):
        self.metadata = {}
        self.paths = paths
    
    def load(self):
        page_data = []
        for path in self.paths:
            reader = PdfReader(path)

            pdf_metadata = reader.metadata or {}
            file_stats = os.stat(path)

            self.metadata = {
                "file_name": os.path.basename(path),
                "file_size_bytes": file_stats.st_size,
                "num_pages": len(reader.pages),
                "pdf_metadata": {
                    "author": pdf_metadata.get("/Author"),
                    # "creator": pdf_metadata.get("/Creator"),
                    # "producer": pdf_metadata.get("/Producer"),
                    # "subject": pdf_metadata.get("/Subject"),
                    "title": pdf_metadata.get("/Title"),
                    "creation_date": pdf_metadata.get("/CreationDate"),
                    "mod_date": pdf_metadata.get("/ModDate"),
                }
            }

            for page_number, page in enumerate(reader.pages, start=1):
                page_text = page.extract_text()
                if page_text:
                    page_data.append({
                        "metadata": self.metadata,
                        "page_number": page_number,
                        "text": page_text,
                    })

        return {
            "page_data": page_data
        }
    

class TextSplitter:
    def __init__(self, chunk_size=500, overlap=100):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def estimate_tokens(self, text):
        return int(len(text.split()) * 1.3)

    def split_into_paragraphs(self, text):
        paragraphs = re.split(r"\n\s*\n", text)
        return [p.strip() for p in paragraphs if p.strip()]

    def split(self, data):
        chunks = []

        for page in data["page_data"]:
            page_number = page["page_number"]
            paragraphs = self.split_into_paragraphs(page["text"])

            current_chunk = ""
            chunk_id = 0

            for para in paragraphs:
                if self.estimate_tokens(current_chunk + " " + para) < self.chunk_size:
                    current_chunk += "\n\n" + para
                else:
                    if current_chunk.strip():
                        chunks.append({
                            "text": current_chunk.strip(),
                            "metadata": {
                                "page_number": page_number,
                                "chunk_id": chunk_id,
                                **page["metadata"]
                            }
                        })
                        chunk_id += 1

                    # overlap using last part of previous chunk
                    overlap_text = current_chunk[-self.overlap:]
                    current_chunk = overlap_text + "\n\n" + para

            if current_chunk.strip():
                chunks.append({
                    "text": current_chunk.strip(),
                    "metadata": {
                        "page_number": page_number,
                        "chunk_id": chunk_id,
                        **page["metadata"]
                    }
                })

        return chunks
    
# class TextSplitter:
#     def __init__(self, chunk_size=500, overlap=150):
#         self.chunk_size = chunk_size
#         self.overlap = overlap

#     def split(self, data):
#         chunks = []

#         for page in data["page_data"]:
#             page_number = page["page_number"]
#             text = page["text"]

#             start = 0
#             chunk_id = 0

#             while start < len(text):
#                 end = start + self.chunk_size
#                 chunk_text = text[start:end]

#                 chunks.append({
#                     "text": chunk_text,
#                     "metadata": {
#                         "page_number": page_number,
#                         "chunk_id": chunk_id,
#                         **page["metadata"]
#                     }
#                 })

#                 start += self.chunk_size - self.overlap
#                 chunk_id += 1

#         return chunks
import os
import tempfile
import uuid

from database import supabase
from rag_pipeline import RAGPipeline

from services.sessions import check_session


# ============================================================
# Upload Documents
# ============================================================

async def upload_documents(session_id: str, files):

    check_session(session_id)

    saved_files = []

    for file in files:

        if not file.filename.lower().endswith(".pdf"):
            raise ValueError(
                f"{file.filename} is not a PDF"
            )

        document_id = str(uuid.uuid4())

        storage_path = (
            f"{session_id}/{document_id}.pdf"
        )

        file_bytes = await file.read()

        # ----------------------------------------------------
        # Upload PDF to Supabase Storage
        # ----------------------------------------------------

        try:

            (
                supabase
                .storage
                .from_("documents")
                .upload(
                    storage_path,
                    file_bytes,
                    {
                        "content-type": "application/pdf",
                    },
                )
            )

        except Exception as e:

            raise RuntimeError(
                f"Failed to upload "
                f"{file.filename}: {str(e)}"
            )

        # ----------------------------------------------------
        # Create database document
        # ----------------------------------------------------

        try:

            (
                supabase
                .table("documents")
                .insert({
                    "id": document_id,
                    "session_id": session_id,
                    "original_filename": file.filename,
                    "storage_path": storage_path,
                    "status": "uploaded",
                })
                .execute()
            )

        except Exception as e:

            raise RuntimeError(
                f"Failed to create document record "
                f"for {file.filename}: {str(e)}"
            )

        saved_files.append({
            "document_id": document_id,
            "original_name": file.filename,
            "storage_path": storage_path,
        })

    return saved_files


# ============================================================
# Index Documents
# ============================================================

def index_documents(session_id: str):

    check_session(session_id)

    # --------------------------------------------------------
    # Get documents belonging to session
    # --------------------------------------------------------

    response = (
        supabase
        .table("documents")
        .select(
            "id, original_filename, storage_path, status"
        )
        .eq("session_id", session_id)
        .execute()
    )

    documents = response.data

    if not documents:
        raise ValueError(
            "No PDF documents uploaded"
        )

    temp_files = []

    try:

        # ====================================================
        # Download PDFs
        # ====================================================

        pdf_documents = []

        for document in documents:

            storage_path = document["storage_path"]

            if not storage_path:

                raise ValueError(
                    f"Document "
                    f"{document['original_filename']} "
                    f"has no storage path"
                )

            try:

                pdf_bytes = (
                    supabase
                    .storage
                    .from_("documents")
                    .download(storage_path)
                )

            except Exception as e:

                raise RuntimeError(
                    f"Failed to download "
                    f"{document['original_filename']}: "
                    f"{str(e)}"
                )

            # ------------------------------------------------
            # Create temporary PDF
            # ------------------------------------------------

            temp_file = tempfile.NamedTemporaryFile(
                suffix=".pdf",
                delete=False,
            )

            temp_file.write(pdf_bytes)
            temp_file.close()

            temp_files.append(temp_file.name)

            # ------------------------------------------------
            # Preserve document identity
            # ------------------------------------------------

            pdf_documents.append({
                "path": temp_file.name,
                "document_id": document["id"],
                "original_filename": (
                    document["original_filename"]
                ),
            })

        # ====================================================
        # Mark documents as indexing
        # ====================================================

        for document in documents:

            (
                supabase
                .table("documents")
                .update({
                    "status": "indexing"
                })
                .eq("id", document["id"])
                .execute()
            )

        # ====================================================
        # Run RAG pipeline
        # ====================================================

        rag = RAGPipeline(
            pdf_documents=pdf_documents
        )

        chunks, embeddings = rag.build_index()

        # ====================================================
        # Delete previous chunks
        # ====================================================

        (
            supabase
            .table("document_chunks")
            .delete()
            .eq("session_id", session_id)
            .execute()
        )

        # ====================================================
        # Build database rows
        # ====================================================

        rows = []

        for index, chunk in enumerate(chunks):

            metadata = chunk["metadata"]

            rows.append({
                "document_id": metadata["document_id"],
                "session_id": session_id,
                "chunk_index": index,
                "content": chunk["text"],
                "page_number": metadata["page_number"],
                "embedding": embeddings[index].tolist(),
                "metadata": metadata,
            })

        # ====================================================
        # Insert chunks
        # ====================================================

        if rows:

            (
                supabase
                .table("document_chunks")
                .insert(rows)
                .execute()
            )

        # ====================================================
        # Mark documents as indexed
        # ====================================================

        for document in documents:

            (
                supabase
                .table("documents")
                .update({
                    "status": "indexed"
                })
                .eq("id", document["id"])
                .execute()
            )

        # ====================================================
        # Return result
        # ====================================================

        return {
            "status": "complete",
            "session_id": session_id,
            "documents": len(documents),
            "chunks": len(rows),
            "message": (
                "Knowledge base indexed successfully"
            ),
        }

    except Exception:

        # ====================================================
        # Mark documents as failed
        # ====================================================

        for document in documents:

            try:

                (
                    supabase
                    .table("documents")
                    .update({
                        "status": "failed"
                    })
                    .eq("id", document["id"])
                    .execute()
                )

            except Exception:
                pass

        raise

    finally:

        # ====================================================
        # Delete temporary PDFs
        # ====================================================

        for path in temp_files:

            try:
                os.remove(path)

            except OSError:
                pass
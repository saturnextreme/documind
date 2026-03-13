import streamlit as st
from pypdf import PdfReader, PdfWriter
import os
import re
import tempfile
import uuid
import base64
from rag_pipeline import RAGPipeline 

# --- Page Configuration ---
st.set_page_config(page_title="DocuMind AI", layout="wide")

# --- Custom CSS for a "Slick" Look ---
st.markdown("""
    <style>
    .main { background-color: #f5f7f9; }
    .stChatMessage { border-radius: 15px; margin-bottom: 10px; }
    .stButton>button { border-radius: 20px; width: 100%; }
    .pdf-container { border: 1px solid #ccc; border-radius: 10px; overflow: hidden; background: white; }
    </style>
    """, unsafe_allow_html=True)

# --- Session State Initialization ---
if "rag" not in st.session_state: st.session_state.rag = None
if "messages" not in st.session_state: st.session_state.messages = []
if "file_map" not in st.session_state: st.session_state.file_map = {}
if "active_view" not in st.session_state: st.session_state.active_view = None

# --- Helper: Extract Single Page using pypdf ---
def get_pdf_page_base64(filename, page_num):
    full_path = st.session_state.file_map.get(filename)
    if not full_path or not os.path.exists(full_path):
        return None
    
    try:
        reader = PdfReader(full_path)
        writer = PdfWriter()
        # pypdf is 0-indexed; citations are 1-indexed
        writer.add_page(reader.pages[int(page_num) - 1])
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            writer.write(tmp.name)
            with open(tmp.name, "rb") as f:
                base64_pdf = base64.b64encode(f.read()).decode('utf-8')
            return base64_pdf
    except Exception as e:
        st.error(f"Error extracting page: {e}")
        return None

# --- Sidebar: Document Center & Viewer ---
with st.sidebar:
    st.title("📂 Document Center")
    uploaded_files = st.file_uploader("Upload PDFs", type="pdf", accept_multiple_files=True)
    
    col1, col2 = st.columns(2)
    with col1:
        process_btn = st.button("Build Index", type="primary", use_container_width=True)
    with col2:
        clear_chat_btn = st.button("Clear Chat", use_container_width=True)

    if clear_chat_btn:
        st.session_state.messages = []
        st.session_state.active_view = None
        st.rerun()

    # --- Indexing Logic ---
    if process_btn and uploaded_files:
        with st.status("🚀 Processing documents...", expanded=True) as status:
            temp_paths = []
            current_sid = str(uuid.uuid4())[:8]
            
            for f in uploaded_files:
                # Rename to name-sessionid.pdf
                new_name = f"{os.path.splitext(f.name)[0]}-{current_sid}.pdf"
                path = os.path.join(tempfile.gettempdir(), new_name)
                with open(path, "wb") as out: out.write(f.getvalue())
                
                temp_paths.append(path)
                st.session_state.file_map[new_name] = path
            
            st.write("Syncing Knowledge Base...")
            try:
                rag = RAGPipeline(pdf_paths=temp_paths)
                rag.session_id = current_sid
                rag.build_index()
                st.session_state.rag = rag
                status.update(label="✅ Indexing Complete!", state="complete", expanded=False)
            except Exception as e:
                st.error(f"Error: {e}")

    # --- Citation Viewer (Inside Sidebar) ---
    if st.session_state.active_view:
        st.divider()
        st.subheader("📄 Citation Preview")
        view = st.session_state.active_view
        
        pdf_b64 = get_pdf_page_base64(view['file'], view['page'])
        if pdf_b64:
            pdf_display = f'<iframe src="data:application/pdf;base64,{pdf_b64}" width="100%" height="500" type="application/pdf"></iframe>'
            st.markdown(f'<div class="pdf-container">{pdf_display}</div>', unsafe_allow_html=True)
            st.caption(f"Source: {view['file']} (Page {view['page']})")
        
        if st.button("Close Preview", use_container_width=True):
            st.session_state.active_view = None
            st.rerun()

# --- Main Chat Interface ---
st.title("💬 Chat with your PDF")

# Display messages
for i, msg in enumerate(st.session_state.messages):
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        
        if msg["role"] == "assistant":
            # Updated Regex: Capture anything after 'Page:' until the closing bracket
            match = re.search(r"\(File:\s*(.*?),\s*Page:\s*([\d,\s]+)\)", msg["content"])
            
            if match:
                file_name = match.group(1).strip()
                page_raw = match.group(2).strip()
                page_list = [p.strip() for p in page_raw.split(",")]
                
                st.write("🔍 **View Sources:**")
                button_cols = st.columns([0.15] * len(page_list) + [1.0 - (0.15 * len(page_list))])
                
                for idx, p_num in enumerate(page_list):
                    if button_cols[idx].button(f"P{p_num}", key=f"btn_{i}_{p_num}"):
                        st.session_state.active_view = {"file": file_name, "page": p_num}
                        st.rerun()
        else:
            st.markdown(msg["content"])
# Chat Input
if prompt := st.chat_input("Ask a question about your documents..."):
    if st.session_state.rag:
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"): st.markdown(prompt)
        
        with st.chat_message("assistant"):
            with st.spinner("Analyzing Knowledge Base..."):
                try:
                    query_prompt = st.session_state.rag.query(prompt, k=5)
                    result = st.session_state.rag.generate(query_prompt)
                    st.markdown(result)
                    st.session_state.messages.append({"role": "assistant", "content": result})
                    st.rerun()
                except Exception as e:
                    st.error(f"Error: {e}")
    else:
        st.warning("Please build the index first.")
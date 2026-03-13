# 📄 DocuMind

**DocuMind** is a high-performance, AI-driven document intelligence platform. It allows users to upload, index, and query PDF documents using Google's **Gemini AI** for reasoning and **Supabase** for vector storage and database management.

---

## ✨ Features

* **🤖 Gemini AI Integration:** Leverages `gemini-3-flash-preview` (or flash) for high-accuracy document summarization and Q&A.
* **📂 PDF Intelligence:** Advanced text extraction and chunking for complex PDF structures.
* **⚡ Vector Search:** Integrated with **Supabase pgvector** for lightning-fast semantic retrieval.
* **🔐 Secure Backend:** Full integration with Supabase Auth and Storage for private document handling.
* **💬 Context-Aware Chat:** Maintains conversation history while citing specific pages from your PDFs.
* **📊 Metadata Tracking:** Automatically extracts document metadata (titles, dates, authors).

---

## 🛠️ Tech Stack

* **Frontend:** Streamlit
* **AI Engine:** Google Gemini SDK
* **Database:** Supabase (PostgreSQL + pgvector)
* **Middleware:** Sentence Transformer all-MiniLM-L6-v2

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone [https://github.com/saturnextreme/documind.git](https://github.com/saturnextreme/documind.git)

# Navigate into the project
cd documind

# Install dependencies
npm install
2. Environment Setup
Create a .env.local file in your root directory and populate it with your credentials:

Code snippet
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_or_service_role_key
Note: Ensure that pgvector is enabled in your Supabase dashboard under "Extensions."

3. Database Schema (Vector Search)
To enable vector search in your Supabase instance, run the following SQL in your Supabase SQL Editor:

SQL
-- Enable the pgvector extension
create extension if then exists vector;

-- Create a table for document chunks
create table document_sections (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(768) -- Matches Gemini embedding dimensions
);
4. Development
Bash
npm run dev
Open http://localhost:3000 to view the application.

🤝 Contributing
Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📝 License
Distributed under the MIT License. See LICENSE for more information.

Built with ❤️ by saturnextreme
export type Session = {
  id: string;
  created_at: string;
  status: "no_documents" | "uploaded" | "indexing" | "indexed" | "failed";
};
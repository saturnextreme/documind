export type Session = {
  id: string;
  created_at: string;
  title: string | null;
  status: "no_documents" | "uploaded" | "indexing" | "indexed" | "failed";
};
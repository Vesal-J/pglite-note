export interface Note {
  id: string;
  title: string;
  preview: string;
  lastModified: string;
  isActive?: boolean;
  content?: string;
}

export interface NoteMetadata {
  id: string;
  title: string;
  preview: string;
  lastModified: string;
  isActive?: boolean;
} 
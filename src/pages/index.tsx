import { useEffect, useState } from "react";
import { YooptaContentValue } from "@yoopta/editor";
import Sidebar from "../components/Sidebar";
import WithBaseFullSetup from "@/components/FullSetupEditor";
import { Database } from "@/utils/database";
import { Note } from "@/types/db";
import { generateContent, getContentPreview } from "@/utils/editor";

const parseNoteContent = (content: string): YooptaContentValue => {
  if (!content || content.trim() === "") {
    return {};
  }

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    console.warn("Content is not valid JSON, treating as plain text:", content);
    return generateContent(content);
  }
};

export default function Editor() {
  const [value, setValue] = useState<YooptaContentValue>();
  const [selectedNoteId, setSelectedNoteId] = useState<number>(1);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNoteSelect = (noteId: number) => {
    setSelectedNoteId(noteId);

    const selectedNote = notes.find((note) => note.id === noteId);
    if (selectedNote) {
      setSelectedNote(selectedNote);

      if (selectedNote.content) {
        const parsedContent = parseNoteContent(selectedNote.content);
        setValue(parsedContent);
      } else {
        setValue({});
      }
    }
  };

  const handleSave = () => {
    if (selectedNote) {
      Database.updateNote(
        {
          title: selectedNote.title,
          content: JSON.stringify(value),
        },
        selectedNoteId
      );
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notes = await Database.getNotes();
        setNotes(notes);

        if (notes.length > 0) {
          setSelectedNote(notes[0]);

          if (notes[0]?.content) {
            const parsedContent = parseNoteContent(notes[0].content);
            setValue(parsedContent);
          } else {
            setValue({});
          }
        } else {
          setSelectedNote(null);
          setValue({});
        }
      } catch (error) {
        console.error("Error loading notes:", error);
        setValue({});
      }
    };
    loadNotes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onNoteSelect={handleNoteSelect}
        selectedNoteId={selectedNoteId}
        notes={notes}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {selectedNote?.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Last edited today</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Share
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {value && (
              <WithBaseFullSetup
                key={selectedNoteId}
                value={value}
                setValue={setValue}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

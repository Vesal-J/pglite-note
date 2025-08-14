import { useEffect, useState } from "react";
import { YooptaContentValue } from "@yoopta/editor";
import Sidebar from "../components/Sidebar";
import WithBaseFullSetup from "@/components/FullSetupEditor";
import { Database } from "@/utils/database";
import { Note } from "@/types/db";
import { generateContent } from "@/utils/editor";

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
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");

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
    if (selectedNote && selectedNoteId !== null) {
      Database.updateNote(
        {
          title: selectedNote.title,
          content: JSON.stringify(value),
        },
        selectedNoteId
      );
    }
  };

  const handleTitleSave = async () => {
    if (selectedNote && selectedNoteId !== null && editingTitle.trim() !== "") {
      const updatedNote = {
        ...selectedNote,
        title: editingTitle.trim(),
      };
      
      await Database.updateNote(updatedNote, selectedNoteId);
      setSelectedNote(updatedNote);
      
      // Update the notes array
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === selectedNoteId 
            ? { ...note, title: editingTitle.trim() }
            : note
        )
      );
      
      setIsEditingTitle(false);
    }
  };

  const handleTitleEdit = () => {
    if (selectedNote) {
      setEditingTitle(selectedNote.title);
      setIsEditingTitle(true);
    }
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setEditingTitle("");
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      handleTitleCancel();
    }
  };

  const addNewNote = async () => {
    const newNote = {
      id: notes.length + 1,
      title: "New Note",
      content: JSON.stringify({}),
    };

    await Database.createNote(newNote);
    loadNotes();
  };

  const loadNotes = async () => {
    try {
      const notes = await Database.getNotes();
      setNotes(notes);
      console.table(notes);

      if (notes.length > 0) {
        const firstNote = notes[0];
        setSelectedNote(firstNote);
        setSelectedNoteId(firstNote.id); // Set the correct selectedNoteId

        if (firstNote?.content) {
          const parsedContent = parseNoteContent(firstNote.content);
          setValue(parsedContent);
        } else {
          setValue({});
        }
      } else {
        setSelectedNote(null);
        setSelectedNoteId(null);
        setValue({});
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      setValue({});
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onNoteSelect={handleNoteSelect}
        selectedNoteId={selectedNoteId || undefined}
        notes={notes}
        addNewNote={addNewNote}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {isEditingTitle ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="text-lg font-medium text-gray-900 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleTitleCancel}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 
                    className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleTitleEdit}
                    title="Click to edit title"
                  >
                    {selectedNote?.title}
                  </h2>
                  <button
                    onClick={handleTitleEdit}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit title"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Last edited today</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {value && selectedNoteId !== null && (
              <WithBaseFullSetup
                key={`note-${selectedNoteId}`}
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

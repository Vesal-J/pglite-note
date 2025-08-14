import { useState } from "react";
import { YooptaContentValue } from "@yoopta/editor";
import Sidebar from "../components/Sidebar";
import ActionMenuList from "@yoopta/action-menu-list";
import LinkTool from "@yoopta/link-tool";
import WithBaseFullSetup from "@/components/FullSetupEditor";

export default function Editor() {
  const [value, setValue] = useState<YooptaContentValue>();
  const [selectedNoteId, setSelectedNoteId] = useState<string>("1");

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    // Here you would typically load the note content
    console.log("Selected note:", noteId);
  };

  const tools = {
    actionMenuList: ActionMenuList,
    linkTool: LinkTool,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onNoteSelect={handleNoteSelect}
        selectedNoteId={selectedNoteId}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {selectedNoteId === "1" && "Welcome to PGLite Notes"}
                {selectedNoteId === "2" && "Meeting Notes - Q1 Planning"}
                {selectedNoteId === "3" && "Project Ideas"}
                {selectedNoteId === "4" && "Daily Journal"}
                {selectedNoteId === "5" && "Reading List"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Last edited today</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Share
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
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
            <WithBaseFullSetup value={value || {}} setValue={setValue} />
          </div>
        </div>
      </div>
    </div>
  );
}

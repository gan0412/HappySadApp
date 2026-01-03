"use client";

import Link from "next/link";
import { useState } from "react";
import { SlateEditor } from "@/components/editor/SlateEditor";
import { CollaborativeSlateEditor } from "@/components/editor/CollaborativeSlateEditor";

export default function HappyPage() {
  const [roomId, setRoomId] = useState("");
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState("");

  const handleStartCollaboration = () => {
    if (roomId.trim()) {
      setCurrentRoomId(roomId.trim());
      setIsCollaborating(true);
    }
  };

  const handleLeaveRoom = () => {
    setIsCollaborating(false);
    setCurrentRoomId("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-green-700 mb-2">
              Happy Editor
            </h1>
            <p className="text-gray-600">
              Transform your text into something positive and uplifting
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            Home
          </Link>
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Real-time Collaboration</h3>
          {!isCollaborating ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter room ID to collaborate (e.g., 'team-meeting-123')"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartCollaboration();
                }}
              />
              <button
                onClick={handleStartCollaboration}
                disabled={!roomId.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Join Room
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">
                Connected to room: {currentRoomId}
              </span>
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Leave Room
              </button>
            </div>
          )}
        </div>

        {isCollaborating ? (
          <CollaborativeSlateEditor
            storageKey={`happy-collab-${currentRoomId}`}
            mode="happy"
            roomId={currentRoomId}
          />
        ) : (
          <SlateEditor storageKey="happy-editor-content" mode="happy" />
        )}
      </div>
    </main>
  );
}

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './RichTextEditor.css'; // Create this file for custom styles

export default function RichTextEditor({ value, onChange }) {
    // Initialize the Tiptap editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    if (!editor) {
        return null; // Prevent rendering until the editor is ready
    }

    // Toolbar Button Component
    const ToolbarButton = ({ action, icon, isActive }) => (
        <button
            className={`p-2 ${isActive ? 'bg-gray-200' : ''} hover:bg-gray-100`}
            onClick={(e) => {
                e.preventDefault();
                action();
            }}
        >
            {icon}
        </button>
    );

    return (
        <div className="space-y-2">

            {/* Toolbar */}
            <div className="flex space-x-2 border-b pb-2 mb-2">
                <ToolbarButton
                    action={() => editor.chain().focus().toggleBold().run()}
                    icon={<b>B</b>}
                    isActive={editor.isActive('bold')}
                />
                <ToolbarButton
                    action={() => editor.chain().focus().toggleItalic().run()}
                    icon={<i>I</i>}
                    isActive={editor.isActive('italic')}
                />
                <ToolbarButton
                    action={() => editor.chain().focus().toggleStrike().run()}
                    icon={<s>S</s>}
                    isActive={editor.isActive('strike')}
                />
                <ToolbarButton
                    action={() => editor.chain().focus().toggleBulletList().run()}
                    icon={<span>• List</span>}
                    isActive={editor.isActive('bulletList')}
                />
                <ToolbarButton
                    action={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={<span>1. List</span>}
                    isActive={editor.isActive('orderedList')}
                />
            </div>

            {/* Editor Content */}
            <div className="border rounded bg-white">
                <EditorContent editor={editor} onChange={onChange} className=" p-3 focus:outline-none" />
            </div>

            <p className="text-sm text-gray-500">
                Use the toolbar to format your text with bold, italics, strikethrough, bullet points, and numbered lists.
            </p>
        </div>
    );
}

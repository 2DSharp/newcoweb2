import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './RichTextEditor.css';

export default function RichTextEditor({ 
    value = '', 
    onChange, 
    className = '', 
    style = {},
    editorClassName = '',
    editorStyle = {},
    placeholder = '' 
}) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (html !== value) {
                onChange(html);
            }
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none',
            },
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false)
        }
    }, [value, editor])

    if (!editor) {
        return null;
    }

    // Toolbar Button Component
    const ToolbarButton = ({ action, icon, isActive }) => (
        <button
            type="button"
            className={`p-2 ${isActive ? 'bg-gray-200' : ''} hover:bg-gray-100`}
            onClick={(e) => {
                e.preventDefault();
                action();
            }}
        >
            {icon}
        </button>
    );

    const toggleList = (listType) => {
        if (editor.isActive(listType)) {
            editor.chain().focus().liftListItem('listItem').run();
        } else {
            editor.chain().focus().toggleList(listType, 'listItem').run();
        }
    };

    return (
        <div className={`space-y-2 ${className}`} style={style}>
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
                    action={() => toggleList('bulletList')}
                    icon={<span>• List</span>}
                    isActive={editor.isActive('bulletList')}
                />
                <ToolbarButton
                    action={() => toggleList('orderedList')}
                    icon={<span>1. List</span>}
                    isActive={editor.isActive('orderedList')}
                />
            </div>

            {/* Editor Content */}
            <div className="border rounded bg-white">
                <EditorContent 
                    editor={editor} 
                    onChange={onChange} 
                    className={`p-3 focus:outline-none ${editorClassName}`}
                    style={editorStyle}
                />
            </div>
        </div>
    );
}

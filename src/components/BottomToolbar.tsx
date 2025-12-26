import { Bold, Italic, Underline, Strikethrough, Link, Code, ChevronDown } from 'lucide-react';
import { useEditor } from '@tiptap/react';
import { useState } from 'react';

interface BottomToolbarProps {
  editor: ReturnType<typeof useEditor> | null;
}

export function BottomToolbar({ editor }: BottomToolbarProps) {
  const [textStyleOpen, setTextStyleOpen] = useState(false);

  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-panel-bg border border-border rounded-lg px-2 py-1.5 shadow-lg">
        {/* Text Style Dropdown */}
        <div className="relative">
          <button
            onClick={() => setTextStyleOpen(!textStyleOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-white hover:bg-accent rounded transition-colors"
          >
            Text Style
            <ChevronDown size={14} />
          </button>
          {textStyleOpen && (
            <div className="absolute bottom-full left-0 mb-2 bg-panel-bg border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
              <button
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setTextStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
              >
                Paragraph
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setTextStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
              >
                Heading 1
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setTextStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
              >
                Heading 2
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setTextStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
              >
                Heading 3
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleBulletList().run();
                  setTextStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
              >
                Bullet List
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleOrderedList().run();
                  setTextStyleOpen(false);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
              >
                Numbered List
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Formatting buttons */}
        <button
          onClick={toggleBold}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold')
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white hover:bg-accent'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={toggleItalic}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic')
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white hover:bg-accent'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={toggleUnderline}
          className={`p-2 rounded transition-colors ${
            editor.isActive('underline')
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white hover:bg-accent'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>

        <button
          onClick={toggleStrike}
          className={`p-2 rounded transition-colors ${
            editor.isActive('strike')
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white hover:bg-accent'
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <button
          onClick={setLink}
          className={`p-2 rounded transition-colors ${
            editor.isActive('link')
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white hover:bg-accent'
          }`}
          title="Add Link"
        >
          <Link size={16} />
        </button>

        <button
          onClick={toggleCode}
          className={`p-2 rounded transition-colors ${
            editor.isActive('code')
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white hover:bg-accent'
          }`}
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        {/* Text color button */}
        <button
          className="p-2 rounded text-text-secondary hover:text-white hover:bg-accent transition-colors"
          title="Text Color"
        >
          <span className="flex items-center justify-center w-4 h-4 text-sm font-bold border-b-2 border-red-500">
            A
          </span>
        </button>
      </div>
    </div>
  );
}

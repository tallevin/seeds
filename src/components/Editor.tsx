import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Plus, GripVertical } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useEffect, useState, useCallback } from 'react';
import { BottomToolbar } from './BottomToolbar';

const initialContent = `<h1>Generate typical text styles</h1>
<p>Lorem ipsum dolor sit amet consectetur. Dolor non posuere odio pellentesque aliquet ut velit massa. At dui aliquet nisl eget dolor proin arcu diam.</p>
<p><u>Lorem ipsum dolor sit amet consectetur</u>. Dolor non posuere odio pellentesque aliquet ut velit massa. At dui aliquet nisl eget dolor proin arcu diam <span class="ghost-text">ghost writing autocomplete feature style</span></p>
<ul>
<li>Bullet</li>
<li>Bullet</li>
</ul>
<ol>
<li>Bullet</li>
<li>Bullet</li>
</ol>
<p><mark data-color="yellow" class="highlight-yellow">When a relevant seed appears relating to a text block, it's highlighted in the matching colour.</mark> Dolor non posuere odio pellentesque</p>
<p><mark data-color="pink" class="highlight-pink">When a relevant seed appears relating to a text block, it's highlighted in the matching colour.</mark> Dolor non posuere odio pellentesque</p>`;

export function Editor() {
  const { setEditorContent, ghostText } = useApp();
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'highlight-yellow',
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  // Add ghost text on certain conditions
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab' && ghostText && editor) {
      e.preventDefault();
      // Insert ghost text at cursor position
      editor.commands.insertContent(ghostText);
    }
  }, [ghostText, editor]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <div className="flex-1 bg-app-bg overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 px-8">
          {/* Block controls shown on hover */}
          <div className="relative">
            <div
              className="absolute -left-12 top-0 flex items-center gap-1 transition-opacity"
              style={{ opacity: hoveredBlock !== null ? 1 : 0 }}
            >
              <button className="p-1 text-text-muted hover:text-white hover:bg-panel-bg rounded">
                <Plus size={16} />
              </button>
              <button className="p-1 text-text-muted hover:text-white hover:bg-panel-bg rounded cursor-grab">
                <GripVertical size={16} />
              </button>
            </div>

            <EditorContent
              editor={editor}
              className="prose prose-invert max-w-none"
              onMouseMove={(e) => {
                // Simple hover detection for block controls
                const target = e.target as HTMLElement;
                if (target.closest('.ProseMirror')) {
                  setHoveredBlock(0);
                }
              }}
              onMouseLeave={() => setHoveredBlock(null)}
            />
          </div>
        </div>
      </div>
      <BottomToolbar editor={editor} />
    </>
  );
}

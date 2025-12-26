import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Plus, GripVertical } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useEffect, useState, useCallback, useRef } from 'react';
import { BottomToolbar } from './BottomToolbar';
import type { Heading } from '../types';

export function Editor() {
  const {
    documentTabs,
    activeTabId,
    updateTabContent,
    ghostText,
    setGhostText,
    generateGhostText,
    setHeadings,
    editorScrollRef,
    aiConfig,
  } = useApp();

  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeTab = documentTabs.find(t => t.id === activeTabId);

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
    content: activeTab?.content || '',
    onUpdate: ({ editor }) => {
      if (activeTabId) {
        updateTabContent(activeTabId, editor.getHTML());
      }

      // Extract headings
      const headingElements = editor.view.dom.querySelectorAll('h1, h2, h3');
      const extractedHeadings: Heading[] = [];

      headingElements.forEach((el, index) => {
        const level = parseInt(el.tagName[1]);
        const text = el.textContent || '';
        const id = `heading-${index}`;

        // Add data attribute for scroll targeting
        el.setAttribute('data-heading-id', id);

        extractedHeadings.push({ id, level, text });
      });

      setHeadings(extractedHeadings);

      // Generate ghost text with debounce
      if (aiConfig.apiKey) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        const text = editor.getText();
        if (text.length > 20 && text.length < 5000) {
          debounceRef.current = setTimeout(() => {
            const lastParagraph = text.split('\n').filter(Boolean).pop() || '';
            if (lastParagraph.length > 10) {
              generateGhostText(lastParagraph);
            }
          }, 2000);
        }
      }
    },
  });

  // Sync editor content when active tab changes
  useEffect(() => {
    if (editor && activeTab) {
      const currentContent = editor.getHTML();
      if (currentContent !== activeTab.content) {
        editor.commands.setContent(activeTab.content || '');
      }
    }
  }, [activeTabId, editor]);

  // Handle ghost text insertion with Tab key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab' && ghostText && editor && !e.shiftKey) {
      e.preventDefault();
      editor.commands.insertContent(ghostText);
      setGhostText('');
    }
  }, [ghostText, editor, setGhostText]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Clear ghost text when typing
  useEffect(() => {
    if (editor) {
      const handleInput = () => {
        if (ghostText) {
          setGhostText('');
        }
      };

      editor.on('update', handleInput);
      return () => {
        editor.off('update', handleInput);
      };
    }
  }, [editor, ghostText, setGhostText]);

  return (
    <>
      <div ref={editorScrollRef as React.RefObject<HTMLDivElement>} className="flex-1 bg-app-bg overflow-y-auto">
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

            <div className="relative">
              <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none"
                onMouseMove={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('.ProseMirror')) {
                    setHoveredBlock(0);
                  }
                }}
                onMouseLeave={() => setHoveredBlock(null)}
              />

              {/* Ghost text overlay */}
              {ghostText && editor && (
                <div className="pointer-events-none absolute bottom-4 left-0 right-0">
                  <div className="text-text-muted text-sm opacity-50 italic">
                    {ghostText}
                    <span className="ml-2 text-xs text-text-secondary">(Tab to insert)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomToolbar editor={editor} />
    </>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const COLORS = [
  { label: "默认", value: "inherit" },
  { label: "红", value: "#dc2626" },
  { label: "橙", value: "#ea580c" },
  { label: "蓝", value: "#2563eb" },
  { label: "绿", value: "#16a34a" },
  { label: "紫", value: "#9333ea" },
  { label: "灰", value: "#6b7280" },
];

export default function RichTextEditor({ value, onChange }: Props) {
  const [showColor, setShowColor] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolBtn = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-sm border rounded ${
        active ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolBtn>

        {/* 分割线 */}
        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* 颜色按钮 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColor(!showColor)}
            className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="w-3 h-3 rounded-sm border border-gray-400 inline-block" style={{ backgroundColor: editor.getAttributes("textStyle").color || "transparent" }} />
            A
          </button>
          {showColor && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2 flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    if (c.value === "inherit") {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(c.value).run();
                    }
                    setShowColor(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value === "inherit" ? "white" : c.value }}
                  title={c.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* 分割线 */}
        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-50"
        >
          ──
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}

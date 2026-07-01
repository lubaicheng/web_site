"use client";

import { useState } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  recommend: string; // e.g., "建议尺寸：1200×500px，格式：JPG/PNG"
  aspectPreview?: string; // e.g., "aspect-video" for 16:9
};

export default function ImageUploader({ value, onChange, label, recommend, aspectPreview }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-400">{recommend}</p>

      {/* 预览 */}
      {value && (
        <div className={`w-full ${aspectPreview || "h-32"} bg-gray-100 rounded-md overflow-hidden border border-gray-200`}>
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}

      {/* URL 输入 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入图片URL或上传"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm"
        />
      </div>

      {/* 上传按钮 */}
      <label className="inline-flex items-center px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
        {uploading ? "上传中..." : "选择本地图片上传"}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}

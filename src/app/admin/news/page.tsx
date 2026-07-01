"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import RichTextEditor from "@/components/RichTextEditor";

type NewsItem = {
  id: number;
  titleZh: string;
  titleEn: string;
  slug: string;
  publishedAt: string;
  coverImage?: string;
  contentZh?: string;
  contentEn?: string;
};

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这条新闻吗？")) return;
    await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/news", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setShowForm(false);
    setEditing(null);
    fetchItems();
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新闻管理</h1>
        <button
          onClick={() => {
            setEditing({});
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          + 新增新闻
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editing?.id ? "编辑新闻" : "新增新闻"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">中文标题</label>
                <input
                  type="text"
                  value={editing?.titleZh || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, titleZh: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">英文标题</label>
                <input
                  type="text"
                  value={editing?.titleEn || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, titleEn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug（URL标识，留空自动生成）</label>
                <input
                  type="text"
                  value={editing?.slug || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <ImageUploader
                value={(editing as any)?.coverImage || ""}
                onChange={(url) => setEditing({ ...editing, coverImage: url })}
                label="封面图片"
                recommend="建议尺寸：400×300px，格式：JPG/PNG，大小不超过2MB"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">发布时间</label>
                <input
                  type="datetime-local"
                  value={
                    (editing as any)?.publishedAt
                      ? new Date((editing as any).publishedAt)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      publishedAt: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">中文内容</label>
                <RichTextEditor
                  value={(editing as any)?.contentZh || ""}
                  onChange={(html) => setEditing({ ...editing, contentZh: html })}
                />
              </div>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">英文内容</label>
                <RichTextEditor
                  value={(editing as any)?.contentEn || ""}
                  onChange={(html) => setEditing({ ...editing, contentEn: html })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">中文标题</th>
              <th className="px-4 py-3 text-left text-gray-600">英文标题</th>
              <th className="px-4 py-3 text-left text-gray-600">发布时间</th>
              <th className="px-4 py-3 text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{item.titleZh || "-"}</td>
                  <td className="px-4 py-3 text-gray-900">{item.titleEn || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(item.publishedAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditing(item);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

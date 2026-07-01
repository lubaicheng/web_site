"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";

type FriendlyLink = {
  id: number;
  imageUrl: string;
  url: string;
  name: string;
  order: number;
};

export default function AdminLinksPage() {
  const [items, setItems] = useState<FriendlyLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除该友情链接吗？")) return;
    await fetch("/api/links", {
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
    await fetch("/api/links", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setShowForm(false);
    setEditing(null);
    fetchItems();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, imageUrl: data.url });
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">友情链接管理</h1>
        <button onClick={() => { setEditing({}); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">+ 添加链接</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <h2 className="text-lg font-bold mb-4">{editing?.id ? "编辑友情链接" : "添加友情链接"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">网站名称</label>
                <input type="text" value={editing?.name || ""} onChange={(e) => setEditing({...editing, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">链接URL</label>
                <input type="text" value={editing?.url || ""} onChange={(e) => setEditing({...editing, url: e.target.value})} placeholder="例：www.example.com 或 https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
              </div>
              <ImageUploader
                value={editing?.imageUrl || ""}
                onChange={(url) => setEditing({...editing, imageUrl: url})}
                label="友情链接图片"
                recommend="建议尺寸：200×80px（横版长条），格式：JPG/PNG，大小不超过1MB"
                aspectPreview="h-12"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">排序</label>
                <input type="number" value={editing?.order ?? 0} onChange={(e) => setEditing({...editing, order: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">取消</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">名称</th>
              <th className="px-4 py-3 text-left text-gray-600">图片</th>
              <th className="px-4 py-3 text-left text-gray-600">链接</th>
              <th className="px-4 py-3 text-left text-gray-600">排序</th>
              <th className="px-4 py-3 text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无数据</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{item.name || "-"}</td>
                  <td className="px-4 py-3">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-8 w-auto" /> : "-"}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{item.url}</td>
                  <td className="px-4 py-3 text-gray-500">{item.order}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(item); setShowForm(true); }} className="text-blue-600 hover:underline mr-3">编辑</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">删除</button>
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

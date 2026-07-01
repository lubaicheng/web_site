"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";

type CarouselImage = {
  id: number;
  imageUrl: string;
  order: number;
};

export default function AdminCarouselPage() {
  const [items, setItems] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/carousel");
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
    if (!confirm("确定要删除该轮播图吗？")) return;
    await fetch("/api/carousel", {
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
    await fetch("/api/carousel", {
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
    if (data.url) {
      setEditing({ ...editing, imageUrl: data.url });
    }
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">轮播图管理</h1>
        <button onClick={() => { setEditing({}); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">+ 添加轮播图</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <h2 className="text-lg font-bold mb-4">{editing?.id ? "编辑轮播图" : "添加轮播图"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploader
                value={editing?.imageUrl || ""}
                onChange={(url) => setEditing({...editing, imageUrl: url})}
                label="轮播图片"
                recommend="建议尺寸：1200×500px（约2.4:1横版），格式：JPG/PNG，大小不超过2MB"
                aspectPreview="aspect-video"
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

      {/* Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">暂无轮播图</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">排序: {item.order}</span>
                <div>
                  <button onClick={() => { setEditing(item); setShowForm(true); }}
                    className="text-blue-600 hover:underline text-sm mr-2">编辑</button>
                  <button onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:underline text-sm">删除</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

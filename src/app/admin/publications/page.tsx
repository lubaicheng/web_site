"use client";

import { useEffect, useState } from "react";

type Publication = {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  link: string;
};

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/publications");
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
    if (!confirm("确定要删除这篇论文吗？")) return;
    await fetch("/api/publications", {
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
    await fetch("/api/publications", {
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
        <h1 className="text-2xl font-bold text-gray-900">论文管理</h1>
        <button onClick={() => { setEditing({ year: new Date().getFullYear() }); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">+ 新增论文</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editing?.id ? "编辑论文" : "新增论文"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">标题</label>
                <input type="text" value={editing?.title || ""} onChange={(e) => setEditing({...editing, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">作者</label>
                  <input type="text" value={editing?.authors || ""} onChange={(e) => setEditing({...editing, authors: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">期刊</label>
                  <input type="text" value={editing?.journal || ""} onChange={(e) => setEditing({...editing, journal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">年份</label>
                  <input type="number" value={editing?.year || ""} onChange={(e) => setEditing({...editing, year: parseInt(e.target.value) || new Date().getFullYear()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">DOI</label>
                  <input type="text" value={editing?.doi || ""} onChange={(e) => setEditing({...editing, doi: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">外部链接</label>
                  <input type="text" value={editing?.link || ""} onChange={(e) => setEditing({...editing, link: e.target.value})} placeholder="例：www.example.com 或 https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
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
              <th className="px-4 py-3 text-left text-gray-600">标题</th>
              <th className="px-4 py-3 text-left text-gray-600">作者</th>
              <th className="px-4 py-3 text-left text-gray-600">期刊</th>
              <th className="px-4 py-3 text-left text-gray-600">年份</th>
              <th className="px-4 py-3 text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无数据</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{item.authors}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{item.journal}</td>
                  <td className="px-4 py-3 text-gray-600">{item.year}</td>
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

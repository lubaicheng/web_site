"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";

type ResearchArea = {
  id: number;
  titleZh: string;
  titleEn: string;
  slug: string;
  order: number;
};

export default function AdminResearchPage() {
  const [items, setItems] = useState<ResearchArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "descZh" | "descEn">("basic");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/research");
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
    if (!confirm("确定要删除该研究方向吗？")) return;
    await fetch("/api/research", {
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
    await fetch("/api/research", {
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
        <h1 className="text-2xl font-bold text-gray-900">研究方向管理</h1>
        <button onClick={() => { setEditing({ order: 0 }); setShowForm(true); setActiveTab("basic"); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">+ 新增方向</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editing?.id ? "编辑研究方向" : "新增研究方向"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button onClick={() => setActiveTab("basic")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "basic" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"
                }`}>基本信息</button>
              <button onClick={() => setActiveTab("descZh")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "descZh" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"
                }`}>中文描述</button>
              <button onClick={() => setActiveTab("descEn")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "descEn" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"
                }`}>英文描述</button>
            </div>

            <form onSubmit={handleSave}>
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">中文标题</label>
                      <input type="text" value={editing?.titleZh || ""} onChange={(e) => setEditing({...editing, titleZh: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">英文标题</label>
                      <input type="text" value={editing?.titleEn || ""} onChange={(e) => setEditing({...editing, titleEn: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <input type="text" value={editing?.slug || ""} onChange={(e) => setEditing({...editing, slug: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">排序</label>
                      <input type="number" value={editing?.order ?? 0} onChange={(e) => setEditing({...editing, order: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                    </div>
                  </div>
                  <div>
                    <ImageUploader
                      value={editing?.coverImage || ""}
                      onChange={(url) => setEditing({...editing, coverImage: url})}
                      label="封面图片"
                      recommend="建议尺寸：800×400px（2:1横版），格式：JPG/PNG，大小不超过2MB"
                      aspectPreview="aspect-video"
                    />
                  </div>
                </div>
              )}

              {activeTab === "descZh" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">中文描述（支持加粗、列表等格式）</label>
                  <RichTextEditor
                    value={editing?.descriptionZh || ""}
                    onChange={(html) => setEditing({...editing, descriptionZh: html})}
                  />
                </div>
              )}

              {activeTab === "descEn" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">英文描述（支持加粗、列表等格式）</label>
                  <RichTextEditor
                    value={editing?.descriptionEn || ""}
                    onChange={(html) => setEditing({...editing, descriptionEn: html})}
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-100">
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
              <th className="px-4 py-3 text-left text-gray-600">中文标题</th>
              <th className="px-4 py-3 text-left text-gray-600">英文标题</th>
              <th className="px-4 py-3 text-left text-gray-600">排序</th>
              <th className="px-4 py-3 text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">暂无数据</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{item.titleZh || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.titleEn || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{item.order}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(item); setShowForm(true); setActiveTab("basic"); }} className="text-blue-600 hover:underline mr-3">编辑</button>
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

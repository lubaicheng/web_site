"use client";

import { useEffect, useState, useCallback } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";

type TeamMember = {
  id: number;
  nameZh: string;
  nameEn: string;
  titleZh: string;
  titleEn: string;
  group: string;
  order: number;
};

type MemberSection = {
  id: number;
  memberId: number;
  title: string;
  content: string;
  order: number;
};

const GROUP_LABELS: Record<string, string> = {
  supervisor: "导师",
  postdoc: "博士后",
  staff: "职工",
  student: "在校硕博",
  alumni: "毕业生",
};

export default function AdminTeamsPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [sections, setSections] = useState<MemberSection[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "sections">("info");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/teams");
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

  const fetchSections = useCallback(async (memberId: number) => {
    try {
      const res = await fetch(`/api/teams/sections?memberId=${memberId}`);
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch {
      setSections([]);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除该人员吗？")) return;
    await fetch("/api/teams", {
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
    await fetch("/api/teams", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setShowForm(false);
    setEditing(null);
    setSections([]);
    setActiveTab("info");
    fetchItems();
  };

  const openEdit = (member: any) => {
    setEditing(member || { group: "student", order: 0 });
    setShowForm(true);
    setActiveTab("info");
    if (member?.id) {
      fetchSections(member.id);
    } else {
      setSections([]);
    }
  };

  const addSection = async () => {
    if (!editing?.id) {
      // Save the member first
      alert("请先保存人员基本信息，再添加子模块");
      return;
    }
    const res = await fetch("/api/teams/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: editing.id, title: "新模块", content: "" }),
    });
    const data = await res.json();
    setSections([...sections, data]);
  };

  const updateSection = async (id: number, field: string, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveSection = async (section: MemberSection) => {
    await fetch("/api/teams/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
  };

  const deleteSection = async (id: number) => {
    if (!confirm("确定要删除该子模块吗？")) return;
    await fetch("/api/teams/sections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = async (id: number, direction: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx < 0) return;
    const newSections = [...sections];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newSections.length) return;
    [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];
    newSections.forEach((s, i) => s.order = i);
    setSections(newSections);
    // Update orders on server
    for (const s of newSections) {
      await fetch("/api/teams/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, order: s.order }),
      });
    }
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">人员管理</h1>
        <button onClick={() => openEdit(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">+ 新增人员</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editing?.id ? "编辑人员" : "新增人员"}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditing(null); setSections([]); setActiveTab("info"); }}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="关闭"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Tab switcher */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button onClick={() => setActiveTab("info")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "info" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>基本信息</button>
              <button onClick={() => setActiveTab("sections")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "sections" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>子模块管理</button>
            </div>

            {activeTab === "info" && (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">中文姓名</label>
                    <input type="text" value={editing?.nameZh || ""} onChange={(e) => setEditing({...editing, nameZh: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">英文姓名</label>
                    <input type="text" value={editing?.nameEn || ""} onChange={(e) => setEditing({...editing, nameEn: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">中文职称</label>
                    <input type="text" value={editing?.titleZh || ""} onChange={(e) => setEditing({...editing, titleZh: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">英文职称</label>
                    <input type="text" value={editing?.titleEn || ""} onChange={(e) => setEditing({...editing, titleEn: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">分类</label>
                    <select value={editing?.group || "student"} onChange={(e) => setEditing({...editing, group: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900">
                      {Object.entries(GROUP_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">排序</label>
                    <input type="number" value={editing?.order ?? 0} onChange={(e) => setEditing({...editing, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                </div>
                <ImageUploader
                  value={editing?.photo || ""}
                  onChange={(url) => setEditing({...editing, photo: url})}
                  label="照片"
                  recommend="建议尺寸：400×500px（3:4竖版），格式：JPG/PNG，大小不超过2MB"
                  aspectPreview="aspect-[3/4]"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input type="email" value={editing?.email || ""} onChange={(e) => setEditing({...editing, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">办公室地址</label>
                    <input type="text" value={editing?.office || ""} onChange={(e) => setEditing({...editing, office: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">电话</label>
                    <input type="text" value={editing?.phone || ""} onChange={(e) => setEditing({...editing, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug（URL标识）</label>
                  <input type="text" value={editing?.slug || ""} onChange={(e) => setEditing({...editing, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">中文简介</label>
                  <textarea rows={3} value={editing?.bioZh || ""} onChange={(e) => setEditing({...editing, bioZh: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">英文简介</label>
                  <textarea rows={3} value={editing?.bioEn || ""} onChange={(e) => setEditing({...editing, bioEn: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setShowForm(false); setEditing(null); setSections([]); }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">取消</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">保存基本信息</button>
                </div>
              </form>
            )}

            {activeTab === "sections" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">子模块列表</h3>
                  <button onClick={addSection}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">+ 添加子模块</button>
                </div>

                {sections.length === 0 ? (
                  <p className="text-gray-400 text-sm">暂无子模块。保存人员基本信息后，点击"添加子模块"创建。</p>
                ) : (
                  <div className="space-y-6">
                    {sections.map((sec, idx) => (
                      <div key={sec.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{idx + 1}</span>
                            <button onClick={() => moveSection(sec.id, "up")}
                              className="text-gray-400 hover:text-gray-700 text-sm" disabled={idx === 0}>↑</button>
                            <button onClick={() => moveSection(sec.id, "down")}
                              className="text-gray-400 hover:text-gray-700 text-sm" disabled={idx === sections.length - 1}>↓</button>
                          </div>
                          <button onClick={() => deleteSection(sec.id)}
                            className="text-red-500 hover:text-red-700 text-sm">删除</button>
                        </div>
                        <div className="mb-3">
                          <label className="block text-xs text-gray-500 mb-1">模块标题</label>
                          <input type="text" value={sec.title}
                            onChange={(e) => updateSection(sec.id, "title", e.target.value)}
                            onBlur={() => saveSection({ ...sec, title: sections.find(s => s.id === sec.id)?.title || sec.title })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm font-medium"
                            placeholder="例如：研究方向、个人简历" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">模块内容（支持加粗、斜体、标题、列表）</label>
                          <RichTextEditor
                            value={sec.content}
                            onChange={(html) => updateSection(sec.id, "content", html)}
                          />
                          <button onClick={() => saveSection(sections.find(s => s.id === sec.id)!)}
                            className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">保存此模块</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">姓名</th>
              <th className="px-4 py-3 text-left text-gray-600">职称</th>
              <th className="px-4 py-3 text-left text-gray-600">分类</th>
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
                  <td className="px-4 py-3 text-gray-900">{item.nameZh || item.nameEn || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.titleZh || item.titleEn || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{GROUP_LABELS[item.group] || item.group}</td>
                  <td className="px-4 py-3 text-gray-500">{item.order}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline mr-3">编辑</button>
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

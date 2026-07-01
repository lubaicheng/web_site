"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";

type SiteConfig = {
  id?: number;
  copyrightZh: string;
  copyrightEn: string;
  addressZh: string;
  addressEn: string;
  email: string;
  phone: string;
  mapImageUrl: string;
  mapLink: string;
  siteNameZh: string;
  siteNameEn: string;
  siteLogo: string;
  homeLeftNewsCount: number;
  homeRightNewsCount: number;
  carouselInterval: number;
};

const defaults: SiteConfig = {
  copyrightZh: "",
  copyrightEn: "",
  addressZh: "",
  addressEn: "",
  email: "",
  phone: "",
  mapImageUrl: "",
  mapLink: "",
  siteNameZh: "",
  siteNameEn: "Jin's Research Group",
  siteLogo: "",
  homeLeftNewsCount: 3,
  homeRightNewsCount: 7,
  carouselInterval: 4,
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data && data.id) {
          setConfig({ ...defaults, ...data });
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMessage("保存成功");
      } else {
        setMessage("保存失败");
      }
    } catch {
      setMessage("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">站点配置</h1>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-lg p-6 space-y-8 max-w-3xl">
        {/* ===== 网站名称 ===== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">网站名称</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">中文网站名</label>
              <input type="text" value={config.siteNameZh} onChange={(e) => setConfig({...config, siteNameZh: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" placeholder="例：金教授课题组" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">英文网站名</label>
              <input type="text" value={config.siteNameEn} onChange={(e) => setConfig({...config, siteNameEn: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" placeholder="例：Jin's Research Group" />
            </div>
          </div>
          <div className="mt-3">
            <ImageUploader
              value={config.siteLogo}
              onChange={(url) => setConfig({...config, siteLogo: url})}
              label="网站 Logo（可选，上传后将替换文字名称）"
              recommend="建议尺寸：120×40px，格式：PNG（透明背景最佳），大小不超过500KB"
              aspectPreview="h-10"
            />
          </div>
        </div>

        {/* ===== 首页新闻数量 ===== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">首页新闻布局</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">左侧图文新闻条数</label>
              <input type="number" min={0} max={20} value={config.homeLeftNewsCount}
                onChange={(e) => setConfig({...config, homeLeftNewsCount: parseInt(e.target.value) || 3})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
              <p className="text-xs text-gray-400 mt-1">首页轮播下方左侧展示带图片的新闻数量，建议 3</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">右侧标题新闻条数</label>
              <input type="number" min={0} max={20} value={config.homeRightNewsCount}
                onChange={(e) => setConfig({...config, homeRightNewsCount: parseInt(e.target.value) || 7})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
              <p className="text-xs text-gray-400 mt-1">首页右侧仅显示标题的新闻数量，建议 7</p>
            </div>
          </div>
        </div>

        {/* ===== 轮播设置 ===== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">轮播图设置</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">自动播放间隔（秒）</label>
            <input type="number" min={1} max={30} value={config.carouselInterval}
              onChange={(e) => setConfig({...config, carouselInterval: parseInt(e.target.value) || 4})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            <p className="text-xs text-gray-400 mt-1">轮播图每隔几秒自动切换到下一张，默认 4 秒</p>
          </div>
        </div>

        {/* ===== 版权信息 ===== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">版权信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">中文版权信息</label>
              <input type="text" value={config.copyrightZh} onChange={(e) => setConfig({...config, copyrightZh: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">英文版权信息</label>
              <input type="text" value={config.copyrightEn} onChange={(e) => setConfig({...config, copyrightEn: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
          </div>
        </div>

        {/* ===== 联系方式 ===== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">联系方式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">中文地址</label>
              <input type="text" value={config.addressZh} onChange={(e) => setConfig({...config, addressZh: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">英文地址</label>
              <input type="text" value={config.addressEn} onChange={(e) => setConfig({...config, addressEn: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" value={config.email} onChange={(e) => setConfig({...config, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input type="text" value={config.phone} onChange={(e) => setConfig({...config, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
          </div>
        </div>

        {/* ===== 地图设置 ===== */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">地图设置</h2>
          <div className="space-y-4">
            <ImageUploader
              value={config.mapImageUrl}
              onChange={(url) => setConfig({...config, mapImageUrl: url})}
              label="地图图片"
              recommend="建议尺寸：600×300px（2:1横版），格式：JPG/PNG，大小不超过2MB"
              aspectPreview="aspect-video"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">外部地图链接（如百度地图/高德地图）</label>
              <input type="text" value={config.mapLink} onChange={(e) => setConfig({...config, mapLink: e.target.value})} placeholder="例：www.example.com 或 https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
            </div>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message === "保存成功" ? "text-green-600" : "text-red-500"}`}>{message}</p>
        )}

        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {saving ? "保存中..." : "保存配置"}
          </button>
        </div>
      </form>
    </div>
  );
}

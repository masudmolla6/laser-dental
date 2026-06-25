import React, { useState } from "react";
import {
  Video,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
  RefreshCw,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  Repeat,
  PlayCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import useVideosSecure from "../../../hooks/useVideosSecure";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageVideos = () => {
  const axiosSecure = useAxiosSecure();
  const [videos, isLoading, refetch, error] = useVideosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title
  const [viewMode, setViewMode] = useState("table"); // table, grid
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 6;

  // ── Helper: Format date without date-fns ──────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // ── Helper: Get relative time ──────────────────────────────────────────
  const getRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  // ── Filter and sort videos ──────────────────────────────────────────────
  const filteredVideos = videos?.filter((video) => {
    const matchesSearch = video.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) || false;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && video.isActive) ||
      (filterStatus === "inactive" && !video.isActive);
    return matchesSearch && matchesStatus;
  });

  const sortedVideos = [...(filteredVideos || [])].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  // ── Pagination ──────────────────────────────────────────────────────────
  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const paginatedVideos = sortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── Toggle Active Status ───────────────────────────────────────────────
  const handleToggleActive = async (video) => {
    setIsProcessing(true);
    try {
      await axiosSecure.patch(`/videos/${video._id}`, {
        isActive: !video.isActive,
      });
      
      Swal.fire({
        icon: "success",
        title: `Video ${!video.isActive ? "Activated" : "Deactivated"}`,
        timer: 1200,
        showConfirmButton: false,
        position: "top-end",
      });
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Set as Active (deactivates all others) ────────────────────────────
  const handleSetActive = async (video) => {
    setIsProcessing(true);
    try {
      await axiosSecure.patch(`/videos/${video._id}`, {
        isActive: true,
      });
      
      Swal.fire({
        icon: "success",
        title: "Video Set Active!",
        text: "This video is now live on the hero section.",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
      });
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to set active",
        text: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Delete Video ──────────────────────────────────────────────────────
  const handleDelete = async (video) => {
    const result = await Swal.fire({
      title: "Delete Video?",
      html: `
        <div class="text-left">
          <p class="text-slate-600">Are you sure you want to delete this video?</p>
          <div class="mt-3 p-3 bg-slate-50 rounded-lg">
            <p class="font-medium text-slate-700">${video.title || "Untitled"}</p>
            <p class="text-xs text-slate-400 truncate">${video.videoUrl}</p>
          </div>
          <p class="text-xs text-red-500 mt-3">⚠️ This action cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      try {
        await axiosSecure.delete(`/videos/${video._id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Video has been removed from the database.",
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
        });
        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: err?.response?.data?.message || "Could not delete video",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // ── Copy to Clipboard ──────────────────────────────────────────────────
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: `${label} copied to clipboard`,
      timer: 1000,
      showConfirmButton: false,
      position: "top-end",
    });
  };

  // ── Open Video in New Tab ─────────────────────────────────────────────
  const openVideo = (url) => {
    window.open(url, "_blank");
  };

  // ── Get Playback Settings Icon ────────────────────────────────────────
  const getPlaybackIcon = (video) => {
    const icons = [];
    if (video.autoplay) icons.push(<PlayCircle key="autoplay" size={12} className="text-sky-500" />);
    if (video.muted) icons.push(<VolumeX key="muted" size={12} className="text-slate-400" />);
    if (video.loop) icons.push(<Repeat key="loop" size={12} className="text-slate-400" />);
    return icons;
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-sky-500" />
        <p className="text-slate-500 mt-4 text-sm font-medium">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center border border-red-100 shadow-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Failed to Load Videos</h3>
          <p className="text-sm text-slate-500">{error.message || "Please try again later"}</p>
          <button
            onClick={refetch}
            className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Render Table View ──────────────────────────────────────────────────
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Video
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Title & Settings
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
              Uploaded
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedVideos.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-12 text-slate-400">
                <Video size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">No videos found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </td>
            </tr>
          ) : (
            paginatedVideos.map((video) => (
              <tr
                key={video._id}
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div 
                    className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer relative group"
                    onClick={() => openVideo(video.videoUrl)}
                  >
                    {video.thumbnailUrl ? (
                      <>
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title || "Video thumbnail"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Video size={16} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-slate-700 truncate max-w-[180px]">
                    {video.title || "Untitled"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getPlaybackIcon(video)}
                    {video.autoplay && video.muted && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-600 font-medium">
                        Auto
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      video.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {video.isActive ? (
                      <CheckCircle size={10} />
                    ) : (
                      <XCircle size={10} />
                    )}
                    {video.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="text-xs text-slate-500">
                    {formatDate(video.createdAt)}
                    <span className="block text-[10px] text-slate-400">
                      {getRelativeTime(video.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => copyToClipboard(video.videoUrl, "Video URL")}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Copy video URL"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => openVideo(video.videoUrl)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Open video"
                    >
                      <ExternalLink size={14} />
                    </button>
                    {!video.isActive && (
                      <button
                        onClick={() => handleSetActive(video)}
                        disabled={isProcessing}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        title="Set as active"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleActive(video)}
                      disabled={isProcessing}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                        video.isActive
                          ? "hover:bg-amber-50 text-amber-500 hover:text-amber-600"
                          : "hover:bg-sky-50 text-slate-400 hover:text-sky-600"
                      }`}
                      title={video.isActive ? "Deactivate" : "Activate"}
                    >
                      {video.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(video)}
                      disabled={isProcessing}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete video"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // ── Render Grid View ──────────────────────────────────────────────────
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {paginatedVideos.length === 0 ? (
        <div className="col-span-full text-center py-12 text-slate-400">
          <Video size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium">No videos found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        paginatedVideos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
          >
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title || "Video thumbnail"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Video size={32} />
                </div>
              )}
              {video.isActive && (
                <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg">
                  <CheckCircle size={10} /> Live
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openVideo(video.videoUrl)}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  <Play size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 truncate">
                    {video.title || "Untitled"}
                  </p>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {getPlaybackIcon(video)}
                    {video.autoplay && video.muted && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-600 font-medium">
                        Auto
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => copyToClipboard(video.videoUrl, "Video URL")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(video)}
                    disabled={isProcessing}
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                      video.isActive
                        ? "hover:bg-amber-50 text-amber-500 hover:text-amber-600"
                        : "hover:bg-sky-50 text-slate-400 hover:text-sky-600"
                    }`}
                    title={video.isActive ? "Deactivate" : "Activate"}
                  >
                    {video.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(video)}
                    disabled={isProcessing}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete video"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    video.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {video.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {getRelativeTime(video.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // ── Main Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1.5">
            <Video size={14} className="text-sky-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Video Management</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">
                Manage Videos
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {videos?.length || 0} videos in total · {videos?.filter(v => v.isActive).length || 0} active
              </p>
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc size={16} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-sky-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Table view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-sky-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Video List ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {viewMode === "table" ? renderTableView() : renderGridView()}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedVideos.length)} of{" "}
              {sortedVideos.length} videos
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                  if (i === 6) pageNum = totalPages;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-sky-500 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Stats Footer ── */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Videos</p>
            <p className="text-2xl font-bold text-slate-800">{videos?.length || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-emerald-600">{videos?.filter(v => v.isActive).length || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Inactive</p>
            <p className="text-2xl font-bold text-slate-400">{videos?.filter(v => !v.isActive).length || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">With Titles</p>
            <p className="text-2xl font-bold text-slate-800">{videos?.filter(v => v.title && v.title.trim() !== "").length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVideos;
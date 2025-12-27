import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building2,
  User,
  FileText,
  Hash,
  Download,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Archive,
  Share2,
  Loader2,
  AlertCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContractStore } from "@/store/contract.store";
import { useBookmarkStore } from "@/store/bookmark.store";
import { useArchiveStore } from "@/store/archive.store";
import { api } from "@/config/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentContract,
    isLoading,
    error,
    fetchContractById,
    clearCurrentContract,
  } = useContractStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const { archiveForUser, isArchivedByUser } = useArchiveStore();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  useEffect(() => {
    if (id) {
      fetchContractById(id);
    }
    return () => clearCurrentContract();
  }, [id, fetchContractById, clearCurrentContract]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!id) return;
      setIsLoadingMedia(true);
      try {
        const { data } = await api.get(`/media?contractId=${id}`);
        if (data.success) {
          setMedia(data.data.media || []);
        }
      } catch {
        setMedia([]);
      } finally {
        setIsLoadingMedia(false);
      }
    };
    fetchMedia();
  }, [id]);

  const bookmarked = id ? isBookmarked(id) : false;
  const archived = id ? isArchivedByUser(id) : false;

  const currentPreviewItem = media[previewIndex];
  const isImage = (mimetype: string) => mimetype?.startsWith("image/");
  const isPdf = (mimetype: string) => mimetype === "application/pdf";
  const canPreview = (mimetype: string) => isImage(mimetype) || isPdf(mimetype);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setImageZoom(1);
    setImageRotation(0);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setImageZoom(1);
    setImageRotation(0);
  };

  const nextPreview = () => {
    const previewableMedia = media.filter((m) => canPreview(m.mimetype));
    const currentPreviewableIndex = previewableMedia.findIndex(
      (m) => m._id === currentPreviewItem?._id
    );
    if (currentPreviewableIndex < previewableMedia.length - 1) {
      const nextItem = previewableMedia[currentPreviewableIndex + 1];
      const nextIndex = media.findIndex((m) => m._id === nextItem._id);
      setPreviewIndex(nextIndex);
      setImageZoom(1);
      setImageRotation(0);
    }
  };

  const prevPreview = () => {
    const previewableMedia = media.filter((m) => canPreview(m.mimetype));
    const currentPreviewableIndex = previewableMedia.findIndex(
      (m) => m._id === currentPreviewItem?._id
    );
    if (currentPreviewableIndex > 0) {
      const prevItem = previewableMedia[currentPreviewableIndex - 1];
      const prevIndex = media.findIndex((m) => m._id === prevItem._id);
      setPreviewIndex(prevIndex);
      setImageZoom(1);
      setImageRotation(0);
    }
  };

  const handleBookmark = async () => {
    if (!id) return;
    if (bookmarked) {
      const success = await removeBookmark(id);
      if (success) toast.success("Bookmark removed");
    } else {
      const success = await addBookmark(id);
      if (success) toast.success("Contract bookmarked");
    }
  };

  const handleArchive = async () => {
    if (!id || archived) return;
    const success = await archiveForUser(id);
    if (success) {
      toast.success("Contract archived");
    } else {
      toast.error("Failed to archive contract");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getFileIcon = (mimetype: string) => {
    if (isImage(mimetype)) return "🖼️";
    if (isPdf(mimetype)) return "📄";
    if (mimetype?.includes("word")) return "📝";
    if (mimetype?.includes("excel") || mimetype?.includes("spreadsheet")) return "📊";
    return "📎";
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !currentContract) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Contract not found</h3>
            <p className="text-muted-foreground mb-4">
              {error ||
                "The contract you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/app")}>Go to Search</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const previewableMedia = media.filter((m) => canPreview(m.mimetype));
  const currentPreviewableIndex = previewableMedia.findIndex(
    (m) => m._id === currentPreviewItem?._id
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">
                {currentContract.contractTitle}
              </h1>
              <Badge
                variant="outline"
                className={getStatusColor(currentContract.status)}
              >
                {currentContract.status || "Unknown"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {currentContract.contractNumber} • {currentContract.year}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleBookmark}>
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleArchive}
            disabled={archived}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Operator</p>
                    <p className="font-medium">{currentContract.operator}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contractor</p>
                    <p className="font-medium">
                      {currentContract.contractorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contract Number
                    </p>
                    <p className="font-medium">
                      {currentContract.contractNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contract Value
                    </p>
                    <p className="font-medium">
                      {formatCurrency(currentContract.contractValue)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {formatDate(currentContract.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {formatDate(currentContract.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
                {media.length > 0 && (
                  <Badge variant="secondary">{media.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMedia ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading documents...
                </div>
              ) : media.length > 0 ? (
                <div className="space-y-2">
                  {media.map((doc, index) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl">{getFileIcon(doc.mimetype)}</span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {doc.originalName || doc.filename}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)} • {doc.mimetype}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {canPreview(doc.mimetype) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openPreview(index)}
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={doc.url} download title="Download">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image/PDF Thumbnails Preview */}
          {previewableMedia.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewableMedia.map((doc) => {
                    const originalIndex = media.findIndex((m) => m._id === doc._id);
                    return (
                      <div
                        key={doc._id}
                        onClick={() => openPreview(originalIndex)}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                      >
                        {isImage(doc.mimetype) ? (
                          <img
                            src={doc.url}
                            alt={doc.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2">
                            <FileText className="h-8 w-8 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground text-center truncate w-full">
                              PDF
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleBookmark}
              >
                {bookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                    Remove Bookmark
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Add Bookmark
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleArchive}
                disabled={archived}
              >
                <Archive className="h-4 w-4 mr-2" />
                {archived ? "Already Archived" : "Archive Contract"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
              {media.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={media[0]?.url} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download Documents
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Year</span>
                <span className="font-medium">{currentContract.year}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Documents</span>
                <span className="font-medium">{media.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Has Documents</span>
                <span className="font-medium">
                  {currentContract.hasDocument ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="truncate pr-4">
                {currentPreviewItem?.originalName || currentPreviewItem?.filename}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {isImage(currentPreviewItem?.mimetype || "") && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setImageZoom((z) => Math.max(0.5, z - 0.25))}
                      disabled={imageZoom <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground w-12 text-center">
                      {Math.round(imageZoom * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                      disabled={imageZoom >= 3}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setImageRotation((r) => (r + 90) % 360)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <a href={currentPreviewItem?.url} download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={currentPreviewItem?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" onClick={closePreview}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 relative overflow-hidden bg-black/5">
            {/* Navigation Arrows */}
            {previewableMedia.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg"
                  onClick={prevPreview}
                  disabled={currentPreviewableIndex <= 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg"
                  onClick={nextPreview}
                  disabled={currentPreviewableIndex >= previewableMedia.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Content */}
            <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
              {currentPreviewItem && isImage(currentPreviewItem.mimetype) && (
                <img
                  src={currentPreviewItem.url}
                  alt={currentPreviewItem.originalName}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                  }}
                />
              )}
              {currentPreviewItem && isPdf(currentPreviewItem.mimetype) && (
                <iframe
                  src={`${currentPreviewItem.url}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  title={currentPreviewItem.originalName}
                />
              )}
            </div>
          </div>

          {/* Footer with pagination info */}
          {previewableMedia.length > 1 && (
            <div className="p-3 border-t text-center text-sm text-muted-foreground">
              {currentPreviewableIndex + 1} of {previewableMedia.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractDetail;

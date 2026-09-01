import { cn } from "@/src/lib/utils";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import type {
  FetchPostFeedItem,
  OrderedPostImage,
} from "@campusly/shared/src/dto/post-dto";
import {
  Ellipsis,
  Heart,
  MessageCircle,
  Share2,
  University,
} from "lucide-react";
import { useState } from "react";
import PostSlideShow from "./post-slide-show";

interface Props {
  post: FetchPostFeedItem;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("tr", {
  numeric: "auto",
});

export default function FeedPost({ post }: Props) {
  const [showSlideShow, setShowSlideShow] = useState<boolean>(false);

  const images = post.images
    .filter((image): image is OrderedPostImage & { signedUrl: string } =>
      Boolean(image.signedUrl),
    )
    .sort((firstImage, secondImage) => firstImage.order - secondImage.order);

  const handleShare = async () => {
    const shareData = {
      title: post.postTitle,
      text: post.postContent,
      url: `${window.location.origin}/posts/${post.postId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
    } catch {
      // The user may have closed the share dialog.
    }
  };

  return (
    <>
      <article className="w-full rounded-lg border border-border bg-card p-5 text-card-foreground transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(23,33,43,0.05)]">
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {post.clubLogoSignedUrl || post.profileImageSignedUrl ? (
                <img
                  src={
                    post.clubLogoSignedUrl ??
                    post.profileImageSignedUrl ??
                    undefined
                  }
                  alt={`${extractPostHeaderText(post)} profil görseli`}
                  className="size-full object-cover"
                />
              ) : (
                <University
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {extractPostHeaderText(post)}
              </p>

              <div className="mt-0.5 flex min-w-0 items-center gap-1 text-xs font-medium text-muted-foreground">
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {getRelativeDate(post.createdAt)}
                </time>
                <span aria-hidden="true">•</span>
                <span className="truncate">
                  {post.clubId ? "Kulüp Duyurusu" : "Öğrenci Paylaşımı"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Gönderi seçenekleri"
          >
            <Ellipsis className="size-5" />
          </button>
        </header>

        <div className={images.length > 0 ? "mb-4" : ""}>
          <h2 className="text-xl font-semibold leading-7 text-foreground">
            {post.postTitle}
          </h2>
          <p className="mt-2 line-clamp-3 whitespace-pre-line text-base leading-6 text-foreground/90">
            {post.postContent}
          </p>
        </div>

        {images.length > 0 && (
          <AspectRatio
            ratio={16 / 9}
            className="group w-full cursor-pointer overflow-hidden rounded-lg bg-muted"
          >
            <PostImageGallery
              images={images}
              title={post.postTitle}
              className="absolute inset-0 z-0 size-full"
            />

            <div
              className="absolute inset-0 z-10 grid place-items-center bg-black/60 opacity-0 
          backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
              onMouseUp={() => setShowSlideShow(true)}
            >
              <span className="text-3xl font-semibold text-white">
                +{images.length}
              </span>
            </div>
          </AspectRatio>
        )}

        <footer className="mt-4 flex items-center justify-between border-t border-border pt-4 text-muted-foreground">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#f0524d]"
              aria-label={`${post.likesCount} beğeni`}
            >
              <Heart className="size-5" />
              <span>{post.likesCount}</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-foreground"
              aria-label={`${post.commentCount} yorum`}
            >
              <MessageCircle className="size-5" />
              <span>{post.commentCount}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-foreground"
            aria-label="Gönderiyi paylaş"
          >
            <Share2 className="size-5" />
            <span>Paylaş</span>
          </button>
        </footer>
      </article>
      {showSlideShow && (
        <PostSlideShow
          imageSignedUrls={post.images
            .map((postImage) => postImage.signedUrl ?? null)
            .filter((x) => x != null)}
          onClose={() => setShowSlideShow(false)}
        />
      )}
    </>
  );
}

interface PostImageGalleryProps {
  images: (OrderedPostImage & { signedUrl: string })[];
  title: string;
  className: string;
}

function PostImageGallery({ images, title, className }: PostImageGalleryProps) {
  if (images.length === 1) {
    return (
      <div
        className={cn(
          "size-full overflow-hidden rounded-lg border border-border bg-muted",
          className,
        )}
      >
        <img
          src={images[0].signedUrl}
          alt={title}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div
        className={cn(
          "grid size-full grid-cols-2 gap-2 overflow-hidden rounded-lg",
          className,
        )}
      >
        {images.map((image, index) => (
          <div
            key={image.imageId}
            className="overflow-hidden border border-border bg-muted first:rounded-l-lg last:rounded-r-lg"
          >
            <img
              src={image.signedUrl}
              alt={`${title} - image ${index + 1}`}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  const visibleImages = images.slice(0, 3);

  return (
    <div
      className={cn(
        "grid size-full grid-cols-2 gap-2 overflow-hidden rounded-lg",
        className,
      )}
    >
      <div className="overflow-hidden rounded-l-lg border border-border bg-muted">
        <img
          src={visibleImages[0].signedUrl}
          alt={`${title} - image 1`}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="grid min-h-0 grid-rows-2 gap-2">
        {visibleImages.slice(1).map((image, index) => {
          return (
            <div
              key={image.imageId}
              className="relative min-h-0 overflow-hidden border border-border bg-muted first:rounded-tr-lg last:rounded-br-lg"
            >
              {index == 1 && images.length > 3 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 text-white">
                  +{images.length - 3}
                </div>
              )}
              <img
                src={image.signedUrl}
                alt={`${title} - image ${index + 2}`}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getRelativeDate(date: Date | string) {
  const createdAt = new Date(date);
  const differenceInSeconds = Math.round(
    (createdAt.getTime() - Date.now()) / 1000,
  );
  const absoluteDifference = Math.abs(differenceInSeconds);

  if (absoluteDifference < 60) {
    return "Şimdi";
  }

  if (absoluteDifference < 3_600) {
    return relativeTimeFormatter.format(
      Math.round(differenceInSeconds / 60),
      "minute",
    );
  }

  if (absoluteDifference < 86_400) {
    return relativeTimeFormatter.format(
      Math.round(differenceInSeconds / 3_600),
      "hour",
    );
  }

  if (absoluteDifference < 604_800) {
    return relativeTimeFormatter.format(
      Math.round(differenceInSeconds / 86_400),
      "day",
    );
  }

  return createdAt.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year:
      createdAt.getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
}

function extractPostHeaderText(post: FetchPostFeedItem) {
  if (post.clubId) {
    return post.clubName ?? "Kulüp Gönderisi";
  }

  return post.authorId || "Öğrenci Gönderisi";
}

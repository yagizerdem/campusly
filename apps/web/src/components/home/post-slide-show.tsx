import useKeyPress from "@/src/hooks/use-key-press";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import { XIcon } from "lucide-react";

interface PostSlideShowProps {
  imageSignedUrls: string[];
  onClose: () => void;
}

export default function PostSlideShow({
  imageSignedUrls,
  onClose,
}: PostSlideShowProps) {
  const images = imageSignedUrls.filter(Boolean);

  useKeyPress(["escape"], () => {
    onClose();
  });

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      className="fixed inset-0 z-50 h-dvh w-screen overflow-hidden bg-black "
      aria-label="Gönderi görselleri"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-30 grid 
        size-10 place-items-center rounded-full
         border border-white/20 bg-black/35 text-white
          backdrop-blur-md transition-colors hover:bg-black/60
           focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-white sm:right-6 sm:top-6 cursor-pointer"
        aria-label="Close image slide viewer"
      >
        <XIcon className="size-5" aria-hidden="true" />
      </button>

      <Carousel opts={{ loop: images.length > 1 }} className="size-full">
        <CarouselContent className="ml-0 h-dvh">
          {images.map((signedUrl, index) => (
            <CarouselItem
              key={`${signedUrl}-${index}`}
              className="relative h-dvh pl-0"
            >
              <img
                src={signedUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-3xl"
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="relative z-10 flex size-full items-center justify-center p-4 sm:p-8 lg:p-12">
                <img
                  src={signedUrl}
                  alt={`Gönderi görseli ${index + 1}`}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious
              className="cursor-pointer left-3 z-20 size-10 border-white/20 bg-black/35
             text-white backdrop-blur-md hover:bg-black/55 hover:text-white sm:left-6"
            />
            <CarouselNext
              className="cursor-pointer right-3 z-20 size-10 border-white/20 bg-black/35
             text-white backdrop-blur-md hover:bg-black/55 hover:text-white sm:right-6"
            />
          </>
        )}
      </Carousel>
    </section>
  );
}

// components/VideoPlayer.tsx
type VideoPlayerProps = {
  link: string;
  onEnded?: () => void;
};

export function VideoPlayer({ link, onEnded }: VideoPlayerProps) {
  return (
    <video
      width={360}
      height={640}
      controls
      className="object-cover w-full h-full"
      onEnded={onEnded}
      autoPlay
    >
      <source src={"/videos/" + link} type="video/mp4" />
    </video>
  );
}

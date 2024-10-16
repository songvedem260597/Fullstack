import React, { useRef, useEffect } from "react";
import "../assets/scss/Lyrics.scss";

interface Lyric {
  time: number;
  text: string;
}

interface LyricsProps {
  lyrics: Lyric[];
  currentLyricIndex: number | null;
  onLyricClick: (lyric: Lyric) => void;
}

const Lyrics: React.FC<LyricsProps> = ({
  lyrics,
  currentLyricIndex,
  onLyricClick,
}) => {
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (lyricsRef.current) {
      if (currentLyricIndex !== null && lyricsRef.current) {
        const activeLyric = lyricsRef.current.children[currentLyricIndex];
        if (activeLyric) {
          const containerHeight = lyricsRef.current.clientHeight;
          const activeLyricHeight = activeLyric.clientHeight;
          const activeLyricOffset =
            activeLyric.getBoundingClientRect().top -
            lyricsRef.current.getBoundingClientRect().top;
          const scrollTop =
            activeLyricOffset +
            lyricsRef.current.scrollTop -
            containerHeight / 2 +
            activeLyricHeight / 2;

          lyricsRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
        }
      } else {
        lyricsRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentLyricIndex]);

  return (
<div ref={lyricsRef} className="lyrics">
      {lyrics.length > 0 ? (
        lyrics.map((lyric, index) => (
          <div
            key={index}
            className={`lyric ${currentLyricIndex === index ? "active" : ""}`}
            onClick={() => onLyricClick(lyric)}
          >
            {lyric.text}
          </div>
        ))
      ) : (
        <div className="no-lyric">Bài hát hiện tại chưa có lời</div>
      )}
    </div>
  );
};

export default Lyrics;

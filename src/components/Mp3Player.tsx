import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import Lyrics from "./Lyrics";
import "../assets/scss/ControlPlayer.scss";

interface Lyric {
  time: number;
  text: string;
}
interface Song {
  audioUrl: string;
  lyricsUrl: string;
  title: string;
  artist: string;
  avatar: string;
}

const parseLrc = (lrcText: string): Lyric[] => {
  const lines = lrcText.split("\n");
  return lines
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3], 10);
        const time = minutes * 60 + seconds + milliseconds / 1000;
        const text = match[4].trim();
        return { time, text };
      }
      return null;
    })
    .filter((item): item is Lyric => item !== null);
};
const AudioPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number | null>(
    null
  );
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [seekValue, setSeekValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        const response = await API.get("/audio");
        const data = response.data;
        setSongs(data.songs);
        fetchLrcData(data.songs[0].lyricsUrl);
      } catch (error) {
        console.error("Error fetching audio data:", error);
      }
    };
    fetchAudioData();
  }, []);
  const fetchLrcData = async (lyricsUrl: string) => {
    try {
      const response = await fetch(lyricsUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const lrcText = await response.text();
      const parsedLyrics = parseLrc(lrcText);
      setLyrics(parsedLyrics);
    } catch (error) {
      console.error("Error fetching LRC data:", error);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (isLoop) {
        setTimeout(() => {
          audio?.load();
          audio?.play();
        }, 1000);
      } else {
        let nextIndex;
        if (isRandom) {
          nextIndex = Math.floor(Math.random() * songs.length);
        } else {
          nextIndex = (currentSongIndex + 1) % songs.length;
        }
        setCurrentSongIndex(nextIndex);
        fetchLrcData(songs[nextIndex].lyricsUrl);
        setTimeout(() => {
          audio?.load();
          audio?.play();
        }, 1000);
      }
    };
    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      if (audio) {
        setDurationTime(audio.duration);
      }
    };
    if (audio) {
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentSongIndex, isLoop, songs]);

  useEffect(() => {
    const current = lyrics
      .filter((lyric) => lyric && (seekTime ?? currentTime) >= lyric.time)
      .pop();
    if (current) {
      const index = lyrics.indexOf(current);
      setCurrentLyricIndex(index);
    }
  }, [currentTime, seekTime, lyrics]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration) {
        setCurrentTime(currentTime);
        if (isDragging == false) {
          const seekTime = (currentTime / duration) * 100;
          setSeekValue(seekTime);
        }
      }
    }
  };
  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (imgRef.current) {
          imgRef.current.classList.add("paused");
        }
      } else {
        audioRef.current.play();
        if (imgRef.current) {
          imgRef.current.classList.remove("paused");
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLyricClick = (lyric: Lyric) => {
    if (audioRef.current) {
      audioRef.current.currentTime = lyric.time;
      setCurrentTime(lyric.time);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(!isPlaying);
      }
    }
    setCurrentLyricIndex(null);
    fetchLrcData(songs[nextIndex].lyricsUrl);
  };

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(!isPlaying);
      }
    }
    setCurrentLyricIndex(null);
    fetchLrcData(songs[prevIndex].lyricsUrl);
  };

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.currentTarget.value);
    setIsDragging(true);
    setSeekValue(newValue);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };
  const toggleRandom = () => {
    setIsRandom(!isRandom);
  };

  const handleSeekCommit = (
    event:
      | React.MouseEvent<HTMLInputElement>
      | React.TouchEvent<HTMLInputElement>
  ) => {
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    setSeekValue(newValue);
    setIsDragging(false);
    const seekTime = (audioRef.current?.duration || 0) * (newValue / 100);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10) / 100;
    setVolume(newVolume * 100);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        src={songs.length > 0 ? songs[currentSongIndex].audioUrl : ""}
      />
      <div className="d-flex wrapper-lyrics">
        <div className="blur-bg-lyrics"></div>
        <img
          className="img-blur"
          src={
            songs.length > 0
              ? songs[currentSongIndex].avatar
              : "default-image-url.jpg"
          }
        />
        <div className="wrapper-img-action">
          <div className="overlay"></div>
          <img
            className={isPlaying ? "playing" : "paused"}
            src={
              songs.length > 0
                ? songs[currentSongIndex].avatar
                : "default-image-url.jpg"
            }
          />
        </div>
        <Lyrics
          lyrics={lyrics}
          currentLyricIndex={currentLyricIndex}
          onLyricClick={handleLyricClick}
        />
      </div>
      <div id="control-player" className="ms-play-control-container">
        <div className="ms-play-control-container-bg"></div>
        <div className="ms-play-control-wrapper">
          <div className="ms-play-control-info">
            <div className="ms-play-control-img-song">
              <button className="equalizer">
                <span className="eq1"></span>
                <span className="eq2"></span>
                <span className="eq3"></span>
              </button>
              <img
                src={
                  songs.length > 0
                    ? songs[currentSongIndex].avatar
                    : "default-image-url.jpg"
                }
                alt="Album Art"
                className="play-control-img-song"
              />
            </div>
            <div className="ms-control-info-song">
              <div className="name-song">
                {songs.length > 0 ? songs[currentSongIndex].title : ""}
              </div>
              <div className="creator">
                {songs.length > 0 ? songs[currentSongIndex].artist : ""}
              </div>
            </div>
          </div>
          <div className="ms-play-control-player">
            <div className="ms-control-player-button-control">
              <i
                onClick={handlePrev}
                className="fas fa-step-backward btn-prev"
              ></i>
              <button className="play-button" onClick={handleTogglePlay}>
                <i
                  className={`fas ${
                    isPlaying ? "fa-pause" : "fa-play"
                  } btn-play`}
                ></i>
              </button>
              <i
                onClick={handleNext}
                className="fas fa-step-forward btn-next"
              ></i>
            </div>
            <div className="ms-player-progress-bar">
              <div className="wrapper-progress-bar">
                <div className="time current-time">
                  {formatTime(currentTime)}
                </div>
                <input
                  className="progress-bar"
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={seekValue}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekCommit}
                  onTouchEnd={handleSeekCommit}
                />
                <div className="time duration-time">
                  {formatTime(durationTime)}
                </div>
              </div>
            </div>
          </div>
          <div className="ms-play-control-right">
            <div className="ms-play-control-random">
              <span
                onClick={toggleRandom}
                className={`${
                  isRandom ? "active-btn" : ""
                } material-icons-outlined btn-random`}
              >
                shuffle
              </span>
            </div>
            <div className="ms-play-control-loop">
              <span
                onClick={toggleLoop}
                className={`${
                  isLoop ? "active-btn" : ""
                } material-icons-outlined btn-loop`}
              >
                loop
              </span>
            </div>
            <div className="ms-play-control-add-play-list">
              <span className="play-lyrics material-icons-outlined">
                mic_none
              </span>
            </div>
            <div className="ms-play-control-volume">
              <i className="fas fa-volume-up btn-volume"></i>
              <input
                className="volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

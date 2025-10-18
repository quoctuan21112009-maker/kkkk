import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, VolumeX, Play, Pause, Download, Heart } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

// --- Changable: Bạn có thể chỉnh sửa các giá trị này ---
const CRUSH_NAME = "YOUR_CRUSH_NAME"; // Thay YOUR_CRUSH_NAME bằng tên crush của bạn
const DEFAULT_MESSAGE = `Gửi ${CRUSH_NAME},\n\nChúc bạn một ngày thật vui vẻ và hạnh phúc!`; // Đổi nội dung mặc định trong textarea
const AUDIO_FILE_NAME = "phep-mau.mp3"; // Đổi tên tệp nhạc nếu cần (đảm bảo file nằm trong thư mục public)
// -----------------------------------------------------

const LovePage = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const [images, setImages] = useState<string[]>([]); // Stores base64 image data
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const { width, height } = useWindowSize();

  // Audio controls
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Image drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Send button logic
  const handleSend = () => {
    setShowConfetti(true);
    setShowHearts(true);
    setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
    setTimeout(() => setShowHearts(false), 3000); // Hearts for 3 seconds
  };

  // Download HTML
  const handleDownloadHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lời nhắn từ ${CRUSH_NAME}</title>
          <style>
              body { font-family: sans-serif; margin: 20px; line-height: 1.6; color: #333; background-color: #f8f8f8; }
              .container { max-width: 800px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
              h1 { color: #e91e63; text-align: center; margin-bottom: 20px; }
              h2 { color: #673ab7; margin-top: 30px; margin-bottom: 15px; }
              .message { white-space: pre-wrap; margin-bottom: 20px; padding: 15px; border: 1px solid #ffe0b2; border-radius: 8px; background-color: #fff3e0; color: #5d4037; }
              .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 20px; }
              .gallery img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); object-fit: cover; }
              .footer { text-align: center; margin-top: 40px; color: #777; font-size: 0.9em; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Lời nhắn đặc biệt dành cho ${CRUSH_NAME}</h1>
              <div class="message">${message}</div>
              ${images.length > 0 ? `
              <h2>Những hình ảnh bạn đã gửi:</h2>
              <div class="gallery">
                  ${images.map(img => `<img src="${img}" alt="Ảnh gửi kèm">`).join("")}
              </div>
              ` : ""}
              <p class="footer">Gửi từ một người đặc biệt!</p>
          </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loi-nhan-cho-${CRUSH_NAME}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Heart animation component
  const HeartsOverlay = () => {
    if (!showHearts) return null;

    const hearts = Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="absolute text-red-500 animate-heart-fall"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          fontSize: `${1 + Math.random() * 2}rem`,
          opacity: 0,
        }}
      >
        ❤️
      </div>
    ));

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {hearts}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 sm:p-8 relative overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      <HeartsOverlay />

      {/* Instructions */}
      <Card className="mb-6 max-w-3xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center text-pink-600">Hướng dẫn</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          <p className="mb-2">Chào bạn! Đây là trang gửi lời nhắn đặc biệt.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Bạn có thể thay đổi tên crush (<code>CRUSH_NAME</code>) và nội dung mặc định (<code>DEFAULT_MESSAGE</code>) trực tiếp trong file <code>src/pages/LovePage.tsx</code>.</li>
            <li>Để nghe nhạc nền, hãy đảm bảo file <code>phep-mau.mp3</code> nằm trong thư mục <code>public</code> của dự án.</li>
            <li>Kéo và thả ảnh vào khu vực "Thư viện ảnh" để thêm ảnh.</li>
            <li>Nhấn "Gửi lời nhắn" để xem hiệu ứng bất ngờ!</li>
            <li>Nút "Tải trang HTML" sẽ tạo một file HTML đơn giản chứa lời nhắn và ảnh của bạn.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Message Input & Audio */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-pink-600">Lời nhắn dành cho {CRUSH_NAME}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Viết lời nhắn của bạn cho ${CRUSH_NAME} ở đây...`}
                rows={8}
                className="w-full resize-y mb-4 border-pink-300 focus:border-pink-500"
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <Button onClick={handleSend} className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white shadow-md">
                  Gửi lời nhắn ✨
                </Button>
                <Button onClick={handleDownloadHtml} variant="outline" className="w-full sm:w-auto border-blue-400 text-blue-600 hover:bg-blue-50">
                  <Download className="h-4 w-4 mr-2" /> Tải trang HTML
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-600">Nhạc nền</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <audio ref={audioRef} src={`/${AUDIO_FILE_NAME}`} loop onEnded={() => setIsPlaying(false)} />
              <Button onClick={togglePlayPause} variant="outline" size="icon" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button onClick={toggleMute} variant="outline" size="icon" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-gray-600">{AUDIO_FILE_NAME}</span>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview & Image Gallery */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">Xem trước lời nhắn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-blue-300 rounded-md bg-blue-50 min-h-[150px] whitespace-pre-wrap text-gray-800 shadow-inner">
                {message}
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white/80 backdrop-blur-sm shadow-lg border-2 border-dashed border-gray-300 p-4 text-center min-h-[150px] flex flex-col justify-center items-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <CardHeader>
              <CardTitle className="text-green-600">Thư viện ảnh (Kéo & Thả)</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
              {images.length === 0 ? (
                <p className="text-gray-500">Kéo và thả ảnh vào đây để thêm.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((imgSrc, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imgSrc}
                        alt={`Uploaded ${index}`}
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleRemoveImage(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LovePage;
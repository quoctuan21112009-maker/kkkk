import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Welcome to Your App</h1>
        <p className="text-xl text-gray-700 mb-6">
          Start building your amazing project here!
        </p>
        <Link to="/love">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Đi đến Trang Lời Nhắn Đặc Biệt ❤️
          </Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
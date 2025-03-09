export default function Navbar() {
  return (
    <>
      <nav className="bg-gray-100 p-4 shadow-md w-full fixed top-0 left-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left Side - Roominate Brand */}
          <div className="relative">
            <a className="text-xl font-bold px-3 py-1 transition-all duration-200 hover:drop-shadow [text-wrap:balance]">
              <span className="text-blue-500">Room</span>
              <span className="text-yellow-500">inate</span>
            </a>
          </div>

          {/* Center/Right Side - All Navigation Buttons */}
          <div className="flex space-x-4">
            <a className="text-black px-3 py-1 transition-all duration-200 hover:drop-shadow [text-wrap:balance]">
              Home
            </a>
            <a className="text-black px-3 py-1 transition-all duration-200 hover:drop-shadow [text-wrap:balance]">
              Browse
            </a>
            <a className="text-black border-2 border-black rounded px-3 py-1 transition-all duration-200 hover:drop-shadow [text-wrap:balance]">
              Profile
            </a>
          </div>
        </div>
      </nav>
      {/* Add spacer div to prevent content from flowing under navbar */}
      <div className="h-16"></div>{" "}
      {/* Adjust height to match navbar if needed */}
    </>
  );
}

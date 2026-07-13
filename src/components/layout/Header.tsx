import Link from 'next/link';
import { MegaMenu } from './MegaMenu';

export function Header() {
  return (
    <header className="relative z-50 bg-[#1a1f2e] text-white overflow-visible">
      {/* Top Bar */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-wider">TECHLAND</h1>
            </Link>

            {/* Top Right Actions */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm">
                🔥 OFFERS
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm">
                🛠️ TOOLS
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm">
                💻 PC BUILDER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Category Dropdown */}
          <select className="bg-gray-700 text-white px-4 py-3 rounded-lg min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Category</option>
            <option>Laptop</option>
            <option>Desktop</option>
            <option>Components</option>
            <option>Accessories</option>
          </select>

          {/* Search Input */}
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <button className="bg-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
              🔍
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors">
              🛒
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors">
              ❤️
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors">
              ⚖️
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <Link href="/admin/login" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              👤
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu Navigation */}
      <MegaMenu />
    </header>
  );
}

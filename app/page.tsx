"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Home, Package } from "lucide-react"
import { motion } from "framer-motion"

interface Product {
  id: number
  title: string
  category: string
  price: string
  image: string
  desc: string
}

const products: Product[] = [
  {
    id: 1,
    title: "WhatsApp GPT-4 Brain",
    category: "AI Agents",
    price: "FREE",
    image: "/whatsapp-chatbot-ai-assistant-interface-with-opena.jpg",
    desc: "Transform WhatsApp into an intelligent assistant with OpenAI context handling.",
  },
  {
    id: 2,
    title: "LinkedIn Lead Scraper",
    category: "Marketing",
    price: "$5.00",
    image: "/linkedin-profile-data-extraction-automation-dashbo.jpg",
    desc: "Automate profile extraction and data enrichment directly to Google Sheets.",
  },
  {
    id: 3,
    title: "Auto-Backup Protocol",
    category: "Utilities",
    price: "FREE",
    image: "/github-backup-automation-workflow-visualization.jpg",
    desc: "Securely backup all n8n workflows to a private GitHub repo nightly.",
  },
  {
    id: 4,
    title: "WooCommerce Sync",
    category: "E-commerce",
    price: "$12.00",
    image: "/woocommerce-order-sync-dashboard-with-airtable-int.jpg",
    desc: "Real-time order sync from Store to Airtable with Slack alerts.",
  },
]

const categories = [
  { name: "🤖 AI Agents", id: "ai" },
  { name: "🚀 Marketing", id: "marketing" },
  { name: "🛠️ Dev Tools", id: "dev" },
  { name: "🛒 E-commerce", id: "ecommerce" },
]

export default function NanoBananaMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount] = useState(2)

  const handleCartClick = () => {
    window.open("https://app.smarterbot.cl", "_blank")
  }

  return (
    <>
      <div className="hidden md:block min-h-screen bg-[#0a0a0a]">
        {/* Desktop Header with Cart */}
        <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#FFE135]/20">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-5xl font-black text-[#FFE135] tracking-tight">Nano Banana</h1>
              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCartClick}
                  className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE135] to-[#FFB800] flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-[#FFE135]/50 transition-all"
                >
                  <ShoppingCart className="w-6 h-6 text-black" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE135] to-[#FFB800] flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-[#FFE135]/50 transition-all"
                >
                  <User className="w-6 h-6 text-black" />
                </motion.div>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FFE135]" />
              <Input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border-2 border-[#FFE135]/30 rounded-2xl pl-16 pr-6 py-7 text-lg text-white placeholder:text-gray-500 focus:border-[#FFE135] focus:ring-2 focus:ring-[#FFE135]/20 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Desktop Hero Featured Banner */}
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFE135] via-[#FFD700] to-[#FFA500] p-12 shadow-2xl"
            >
              <div className="relative z-10 max-w-2xl">
                <div className="inline-block bg-black/20 backdrop-blur-sm rounded-full px-5 py-2 mb-4">
                  <span className="text-sm font-bold text-black tracking-wider">⚡ FEATURED</span>
                </div>
                <h2 className="text-4xl font-black text-black mb-3 leading-tight">New AI Workflow</h2>
                <p className="text-lg text-black/80 font-medium">Build smarter automation with GPT-4 integration</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
            </motion.div>
          </section>

          {/* Desktop Categories */}
          <section className="mb-8">
            <div className="flex gap-4 flex-wrap">
              {categories.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`px-8 py-4 rounded-2xl font-bold text-base border-2 transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#FFE135] text-black border-[#FFE135]"
                      : "bg-[#1a1a1a] text-white border-[#FFE135]/30 hover:border-[#FFE135]"
                  }`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Desktop Product Grid (4 columns) */}
          <section className="pb-16">
            <div className="grid grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-[#1a1a1a] rounded-3xl overflow-hidden border-2 border-[#FFE135]/20 hover:border-[#FFE135] hover:shadow-xl hover:shadow-[#FFE135]/10 transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <span className="text-xs font-bold text-[#FFE135] tracking-wide">
                        {product.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-white mb-3 leading-tight line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.desc}</p>

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-black text-lg ${product.price === "FREE" ? "text-[#FFE135]" : "text-white"}`}
                      >
                        {product.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCartClick}
                        className="w-10 h-10 rounded-full bg-[#FFE135] flex items-center justify-center hover:bg-[#FFD700] hover:shadow-lg transition-all"
                      >
                        <ShoppingCart className="w-5 h-5 text-black" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="md:hidden min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        {/* iPhone 26 Device Frame */}
        <div className="relative w-full max-w-[400px] h-[844px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-[55px] shadow-2xl border-[8px] border-[#1a1a1a] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl z-50" />

          {/* Main Content */}
          <div className="relative h-full overflow-y-auto scrollbar-hide bg-[#0a0a0a]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#FFE135]/20 px-6 pt-12 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-black text-[#FFE135] tracking-tight">Nano Banana</h1>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFE135] to-[#FFB800] flex items-center justify-center cursor-pointer"
                >
                  <User className="w-5 h-5 text-black" />
                </motion.div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFE135]" />
                <Input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a1a] border-2 border-[#FFE135]/30 rounded-2xl pl-12 pr-4 py-6 text-white placeholder:text-gray-500 focus:border-[#FFE135] focus:ring-2 focus:ring-[#FFE135]/20 transition-all"
                />
              </div>
            </header>

            {/* Hero Featured Banner */}
            <section className="px-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFE135] via-[#FFD700] to-[#FFA500] p-6 shadow-xl"
              >
                <div className="relative z-10">
                  <div className="inline-block bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                    <span className="text-xs font-bold text-black tracking-wider">⚡ FEATURED</span>
                  </div>
                  <h2 className="text-xl font-black text-black mb-2 leading-tight">New AI Workflow</h2>
                  <p className="text-sm text-black/80 font-medium">Build smarter automation with GPT-4 integration</p>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
              </motion.div>
            </section>

            {/* Categories Horizontal Scroll */}
            <section className="px-6 py-4">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {categories.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#FFE135] text-black border-[#FFE135]"
                        : "bg-[#1a1a1a] text-white border-[#FFE135]/30 hover:border-[#FFE135]"
                    }`}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Product Grid */}
            <section className="px-6 py-4 pb-24">
              <div className="grid grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-[#1a1a1a] rounded-3xl overflow-hidden border-2 border-[#FFE135]/20 hover:border-[#FFE135] transition-all group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-[10px] font-bold text-[#FFE135] tracking-wide">
                          {product.category.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white mb-2 leading-tight line-clamp-2">{product.title}</h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.desc}</p>

                      {/* Price & Add to Cart */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-black text-sm ${product.price === "FREE" ? "text-[#FFE135]" : "text-white"}`}
                        >
                          {product.price}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCartClick}
                          className="w-8 h-8 rounded-full bg-[#FFE135] flex items-center justify-center hover:bg-[#FFD700] transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-black" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Navigation */}
          <nav className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-[#FFE135]/20 px-6 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              {[
                { icon: Home, label: "Home" },
                { icon: Search, label: "Search" },
                { icon: ShoppingCart, label: "Cart", count: cartCount, onClick: handleCartClick },
                { icon: Package, label: "Profile" },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.9 }}
                  onClick={item.onClick}
                  className={`relative flex flex-col items-center gap-1 ${index === 0 ? "text-[#FFE135]" : "text-gray-500"}`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.count && item.count > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                  <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

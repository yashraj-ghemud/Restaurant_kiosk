"use client"

import { useEffect, useState } from "react"
import api from "../api/api"
import ItemCard from "./ItemCard"
import ItemModal from "./ItemModal"
import { motion, AnimatePresence } from "framer-motion"

export default function Menu({ onAdd }) {
  const [menu, setMenu] = useState([])
  const [category, setCategory] = useState('')
  const [openItem, setOpenItem] = useState(null)

  useEffect(() => {
    let mounted = true
    api
      .get("/menu")
      .then((res) => {
        if (!mounted) return
        setMenu(res.data)
        if (res.data.length) setCategory(res.data[0].category)
      })
      .catch(() => {
        const cached = localStorage.getItem("rk_cached_menu")
        if (cached) {
          const parsed = JSON.parse(cached)
          setMenu(parsed)
          if (parsed.length) setCategory(parsed[0].category)
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (menu.length) localStorage.setItem("rk_cached_menu", JSON.stringify(menu))
  }, [menu])

  const categories = Array.from(new Set(menu.map((m) => m.category)))

  const filtered = menu.filter((m) => m.category === category)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, type: "tween" }}>
      <div className="flex gap-2 mb-4" role="tablist" aria-label="Categories">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded font-semibold transition-all duration-300 ${cat === category
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
            role="tab"
            aria-selected={cat === category}
            whileHover={{
              scale: 1.08,
              boxShadow: cat === category ? "0 0 20px rgba(59, 130, 246, 0.6)" : "0 0 15px rgba(156, 163, 175, 0.4)",
              transition: { type: "tween", duration: 0.25 },
            }}
            whileTap={{ scale: 0.95 }}
            animate={
              cat === category
                ? {
                  boxShadow: [
                    "0 0 10px rgba(59, 130, 246, 0.4)",
                    "0 0 20px rgba(59, 130, 246, 0.6)",
                    "0 0 30px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.6)",
                    "0 0 10px rgba(59, 130, 246, 0.4)",
                  ],
                }
                : {}
            }
            transition={{
              type: "tween",
              duration: 2,
              boxShadow: { duration: 2, repeat: Infinity, type: "tween" },
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.3, type: "tween" }}
              layout
            >
              <ItemCard item={item} onOpen={(i) => setOpenItem(i)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {openItem && <ItemModal item={openItem} open={!!openItem} onClose={() => setOpenItem(null)} onAdd={onAdd} />}
      </AnimatePresence>
    </motion.div>
  )
}

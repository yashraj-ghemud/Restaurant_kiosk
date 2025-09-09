"use client"

import { useEffect, useState } from "react"
import api from "../api/api"
import OrderCard from "../components/OrderCard"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState("all")
  const [showCelebration, setShowCelebration] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let mounted = true
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders?_sort=createdAt&_order=desc")
        if (!mounted) return
        setOrders(res.data)
      } catch (e) {
        // offline / ignore
      }
    }
    fetchOrders()
    const interval = setInterval(fetchOrders, 3000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const onUpdateStatus = async (id, status) => {
    try {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))

      if (status === "completed") {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)

        setTimeout(() => {
          setOrders((prev) => prev.filter((order) => order.id !== id))
        }, 1000)
      }

      await api.patch(`/orders/${id}`, { status })
    } catch (e) {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: order.status } : order)))
      alert("Failed to update status (server offline)")
    }
  }

  const kioskOrders = orders.filter((o) => o.table === "Kiosk-01")
  const filtered = kioskOrders.filter((o) => (filter === "all" ? true : o.status === filter))

  return (
    <motion.div
      className="p-4 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-8xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.2, 1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 2, ease: "easeOut", type: "tween" }}
            >
              🎉🎊✨
            </motion.div>
            <motion.div
              className="absolute text-6xl font-bold text-yellow-300 text-center"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, type: "tween" }}
            >
              ORDER COMPLETED!
            </motion.div>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 50,
                  rotate: 360,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                  type: "tween",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1
        className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-pink-400 via-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent animate-pulse"
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          type: "tween",
        }}
        style={{
          backgroundSize: "200% 200%",
          animation: "rainbow-wave 2s ease-in-out infinite, bounce-glow 1.5s ease-in-out infinite alternate",
        }}
      >
        🍽️ Kitchen Dashboard 🍽️
      </motion.h1>

      <div role="status" aria-live="polite" className="sr-only">
        New orders will appear here
      </div>

      <motion.div
        className="mb-6 flex gap-2 justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={!shouldReduceMotion ? {
          opacity: 1,
          y: [0, -5, 0],
          scale: [1, 1.02, 1],
        } : { opacity: 1, y: 0 }}
        transition={!shouldReduceMotion ? {
          delay: 0.3,
          duration: 0.4,
          y: { duration: 2, repeat: Infinity, ease: "easeInOut", type: "tween" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut", type: "tween" },
        } : { type: "tween", duration: 0.3 }}
      >
        <motion.select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 border-purple-400 rounded-lg px-4 py-2 bg-white/90 backdrop-blur-sm text-purple-800 font-semibold shadow-lg hover:shadow-purple-400/50 transition-all duration-300"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.6)",
          }}
          animate={!shouldReduceMotion ? {
            borderColor: ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7"],
          } : {}}
          transition={!shouldReduceMotion ? {
            borderColor: { duration: 3, repeat: Infinity, ease: "linear", type: "tween" },
          } : {}}
        >
          <option value="all">🌟 All Orders</option>
          <option value="received">📥 Received</option>
          <option value="preparing">👨‍🍳 Preparing</option>
          <option value="ready">✅ Ready</option>
          <option value="completed">🎉 Completed</option>
        </motion.select>
      </motion.div>

      <motion.div className="grid gap-4 max-w-4xl mx-auto" initial="false" animate="true">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              className="text-white text-xl text-center font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={!shouldReduceMotion ? {
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95],
                y: [0, -10, 0],
              } : { opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={!shouldReduceMotion ? {
                opacity: { duration: 2, repeat: Infinity, type: "tween" },
                scale: { duration: 2, repeat: Infinity, type: "tween" },
                y: { duration: 2, repeat: Infinity, type: "tween" },
              } : {}}
            >
              🔍 No orders yet - Kitchen is ready! 🔍
            </motion.div>
          )}
          {filtered.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.45, type: "tween" }}
            >
              <OrderCard order={o} onUpdateStatus={onUpdateStatus} onRemove={() => setOrders(prev => prev.filter(p => p.id !== o.id))} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

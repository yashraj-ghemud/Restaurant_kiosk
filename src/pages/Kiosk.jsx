"use client"

import { useEffect, useState, useRef } from "react"
import Menu from "../components/Menu"
import CartDrawer from "../components/CartDrawer"
import useCart from "../hooks/useCart"
import api from "../api/api"
import { motion, AnimatePresence } from "framer-motion"

export default function Kiosk() {
  const { cart, addToCart, updateQty, removeItem, clearCart, placeOrder, syncOutbox, outboxCount } = useCart()
  const [orderStatus, setOrderStatus] = useState(null) // { id, status }
  const [showReady, setShowReady] = useState(false)
  const [previousOrders, setPreviousOrders] = useState([])
  const pollRef = useRef()

  useEffect(() => {
    const saved = localStorage.getItem("kiosk_previous_orders")
    if (saved) {
      setPreviousOrders(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("kiosk_previous_orders", JSON.stringify(previousOrders))
  }, [previousOrders])

  // Poll for order status if an order is placed
  useEffect(() => {
    if (!orderStatus?.id) return
    let mounted = true
    const poll = async () => {
      try {
        const res = await api.get(`/orders/${orderStatus.id}`)
        if (!mounted) return
        setOrderStatus((s) => (s ? { ...s, status: res.data.status } : null))
        if (res.data.status === "ready" || res.data.status === "completed") {
          setShowReady(true)
          setTimeout(() => setShowReady(false), 3500)
          mounted = false
          clearInterval(pollRef.current)
        }
      } catch {}
    }
    poll()
    pollRef.current = setInterval(poll, 2500)
    return () => {
      mounted = false
      clearInterval(pollRef.current)
    }
  }, [orderStatus?.id])

  const onPlaceOrder = async () => {
    const payload = {
      items: cart,
      total: cart.reduce((s, i) => s + (i.totalPrice || i.price * (i.qty || 1)), 0),
      status: "received",
      createdAt: new Date().toISOString(),
      table: "Kiosk-01",
    }
    const res = await placeOrder(payload)
    if (res.ok) {
      setPreviousOrders((prev) => [{ ...payload, id: res.data.id }, ...prev.slice(0, 9)]) // Keep last 10 orders
      clearCart()
      setOrderStatus({ id: res.data.id, status: "received" })
    } else {
      alert("Offline: Order saved locally. Click Sync when online.")
    }
  }

  const onSync = async () => {
    const ok = await syncOutbox()
    alert(ok ? "All pending orders synced." : "Some orders still pending.")
  }

  const clearPreviousOrders = () => {
    setPreviousOrders([])
    localStorage.removeItem("kiosk_previous_orders")
  }

  return (
    <motion.div
      className="p-4 md:flex gap-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Ready to Eat message */}
      <AnimatePresence>
        {showReady && (
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1.1 }}
            exit={{ y: -80, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="fixed top-6 left-1/2 z-50 -translate-x-1/2 px-8 py-4 rounded-xl bg-yellow-200 shadow-lg border-2 border-yellow-400 text-2xl font-bold text-yellow-900 flex items-center gap-3 animate-pulse"
            style={{ filter: "drop-shadow(0 0 16px #ffe066)" }}
          >
            <span role="img" aria-label="party">
              🎉
            </span>{" "}
            Yehhh! Ready to eat <span className="animate-bounce">🍔🍕🥤</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex-1"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            backgroundPosition: { duration: 3, repeat: Number.POSITIVE_INFINITY },
          }}
          style={{ backgroundSize: "200% 200%" }}
        >
          🍽️ Kiosk — Order 🍽️
        </motion.h1>
        <Menu onAdd={(item) => addToCart(item)} />
        {/* Show order status after placing order */}
        <AnimatePresence>
          {orderStatus && (
            <motion.div
              key={orderStatus.id + orderStatus.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-300 text-blue-900 text-lg font-semibold flex items-center gap-2 shadow"
            >
              <span>Status:</span>
              <span className="capitalize font-bold animate-pulse">{orderStatus.status}</span>
              {orderStatus.status === "ready" && (
                <span role="img" aria-label="ready">
                  🍽️
                </span>
              )}
              {orderStatus.status === "completed" && (
                <span role="img" aria-label="done">
                  ✅
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="w-full md:w-96 space-y-4"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <CartDrawer
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onPlaceOrder={onPlaceOrder}
          onSync={onSync}
          outboxCount={outboxCount}
        />

        {previousOrders.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                "0 0 15px rgba(251, 191, 36, 0.3)",
                "0 0 25px rgba(251, 191, 36, 0.5)",
                "0 0 15px rgba(251, 191, 36, 0.3)",
              ],
            }}
            transition={{
              duration: 0.5,
              boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <motion.h3
                className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                🎊 Previous Orders 🎊
              </motion.h3>
              <motion.button
                onClick={clearPreviousOrders}
                className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-semibold shadow-md"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
                  rotate: [0, -2, 2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 2px 10px rgba(239, 68, 68, 0.3)",
                    "0 2px 15px rgba(239, 68, 68, 0.5)",
                    "0 2px 10px rgba(239, 68, 68, 0.3)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                }}
              >
                🗑️ Clear
              </motion.button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {previousOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-200 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: [1, 1.02, 1],
                    borderColor: ["#fef3c7", "#fbbf24", "#fef3c7"],
                  }}
                  transition={{
                    delay: index * 0.1,
                    scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 },
                    borderColor: { duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 },
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <motion.div
                      className="font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.5,
                      }}
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      Order #{order.id}
                    </motion.div>
                    <motion.div
                      className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-sm"
                      animate={{
                        boxShadow: [
                          "0 0 5px rgba(34, 197, 94, 0.3)",
                          "0 0 10px rgba(34, 197, 94, 0.6)",
                          "0 0 5px rgba(34, 197, 94, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.4,
                      }}
                    >
                      {orderStatus?.id === order.id ? orderStatus.status : order.status}
                    </motion.div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="flex justify-between"
                        animate={{
                          x: [0, 2, 0],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.2 + idx * 0.1,
                        }}
                      >
                        <span>{item.name}</span>
                        <span>x{item.qty}</span>
                      </motion.div>
                    ))}
                    {order.items?.length > 2 && (
                      <motion.div
                        className="text-gray-400 italic"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        +{order.items.length - 2} more items...
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    className="text-right text-sm font-bold text-green-600 mt-2"
                    animate={{
                      scale: [1, 1.05, 1],
                      color: ["#059669", "#10b981", "#059669"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.3,
                    }}
                  >
                    ${order.total?.toFixed(2)}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

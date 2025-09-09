"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import api from "../api/api" // keep using your axios wrapper

// prefer item.image if present, else fallback by name
function getItemImage(itemOrName) {
  const item = typeof itemOrName === "string" ? { name: itemOrName } : itemOrName || {}
  if (item.image) return item.image
  const n = (item.name || "").toLowerCase()
  if (n.includes("burger")) return "/images/burger.png"
  if (n.includes("pizza")) return "/images/pizza.png"
  if (n.includes("coke") || n.includes("cola")) return "/images/cola.png"
  return "/images/placeholder.png"
}

function ConfettiParty({ show }) {
  if (!show) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="text-5xl animate-bounce select-none">
        <span role="img" aria-label="party">
          🎉✨🥳✨🎉<br />
          order completed!
        </span>
      </div>
    </motion.div>
  )
}

export default function OrderCard({ order, onUpdateStatus, onRemove }) {
  const [completed, setCompleted] = useState(false)
  const [showParty, setShowParty] = useState(false)
  const [loading, setLoading] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const created = new Date(order.createdAt).getTime()
  const elapsedMs = Date.now() - created
  const elapsedMin = Math.floor(elapsedMs / 60000)
  const elapsedSec = Math.floor((elapsedMs % 60000) / 1000)
  const overdue = elapsedMin >= 8 // overdue threshold

  const handleComplete = async () => {
    if (loading) return
    setLoading(true)
    setShowParty(true)

    try {
      await api.delete(`/orders/${order.id}`)
      if (onRemove) onRemove(order.id)
      setCompleted(true)
      setTimeout(() => setShowParty(false), 1200)
    } catch (error) {
      console.error("Failed to delete order:", error)
      try {
        await api.patch(`/orders/${order.id}`, { status: "completed" })
        if (onRemove) onRemove(order.id)
        setCompleted(true)
        setTimeout(() => setShowParty(false), 1200)
      } catch (err2) {
        setShowParty(false)
        alert("Failed to remove order from server. Check network or API.")
      }
    } finally {
      setLoading(false)
    }
  }

  const infiniteTween = (dur = 2) => ({ type: "tween", duration: dur, repeat: Infinity, ease: "linear" })

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -10 },
  }

  // Inline styles for flip faces
  const flipOuterStyle = (size = 48) => ({
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    perspective: 900,
    display: "inline-block",
  })
  const flipInnerStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    WebkitTransformStyle: "preserve-3d",
  }
  const faceStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "9999px",
    overflow: "hidden",
  }

  return (
    <AnimatePresence>
      {!completed && (
        <motion.div
          className={`relative p-3 rounded border ${overdue ? "border-red-400 bg-red-50" : "bg-white"}`}
          role="article"
          aria-label={`Order ${order.id}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.45 }}
          style={{
            ...(showParty ? { boxShadow: "0 0 32px 8px #ffe066, 0 0 8px 2px #ff6f61", filter: "brightness(1.05) drop-shadow(0 0 8px #ffe066)" } : undefined),
          }}
        >
          <ConfettiParty show={showParty} />

          <motion.div
            className="flex justify-between items-start"
            {...(!shouldReduceMotion && {
              animate: { y: [0, -3, 0] },
              transition: { ...infiniteTween(6) },
            })}
          >
            <div>
              <motion.div
                className="font-semibold"
                {...(!shouldReduceMotion && {
                  animate: { x: [0, 3, -3, 0] },
                  transition: { ...infiniteTween(5) },
                })}
              >
                #{order.id} — {order.table}
              </motion.div>

              <div className="text-sm text-gray-600" aria-live="polite">
                Status: <span className="font-medium">{order.status}</span>
              </div>
            </div>

            <div className="text-sm">
              {elapsedMin}m {elapsedSec}s
            </div>
          </motion.div>

          <div className="mt-2 text-sm space-y-2">
            {order.items?.map((it, idx) => {
              // get front/back images: item may include .image and optionally .backImage
              const front = it.image || getItemImage(it)
              const back = it.backImage || front

              return (
                <motion.div
                  key={idx}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, type: "tween", duration: 0.36 }}
                >
                  <div className="flex items-center gap-3">
                    {/* FLIP: in-file implementation (no new component) */}
                    {shouldReduceMotion ? (
                      // reduced motion: static front image
                      <img
                        src={front}
                        alt={it.name}
                        className="w-12 h-12 object-cover rounded-full shadow-sm"
                        style={{ width: 48, height: 48 }}
                      />
                    ) : (
                      <div style={flipOuterStyle(48)} aria-hidden>
                        <motion.div
                          style={flipInnerStyle}
                          animate={{ rotateY: [0, 180, 360] }}
                          transition={infiniteTween(2.2)}
                        >
                          {/* FRONT FACE */}
                          <div style={faceStyle}>
                            <img src={front} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          </div>

                          {/* BACK FACE (rotated 180deg) */}
                          <div style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
                            <img src={back} alt={it.name + " (back)"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    <motion.span
                      className="font-medium"
                      {...(!shouldReduceMotion ? {
                        animate: { x: [0, 4, -4, 0] },
                        transition: { ...infiniteTween(3.2) },
                      } : {})}
                    >
                      {it.name} {it.modifiers?.length ? `(${it.modifiers.map((m) => m.name).join(",")})` : ""}
                    </motion.span>
                  </div>

                  <div className="text-sm">x{it.qty}</div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-3 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 8px #ffb347" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(order.id, "preparing")}
              className="px-2 py-1 bg-orange-400 text-white rounded"
              disabled={loading}
            >
              Preparing
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 8px #4ade80" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(order.id, "ready")}
              className="px-2 py-1 bg-green-600 text-white rounded"
              disabled={loading}
            >
              Ready
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12, boxShadow: "0 0 16px #ffe066, 0 0 8px #ff6f61" }}
              whileTap={{ scale: 0.92 }}
              onClick={handleComplete}
              className="px-2 py-1 bg-gray-600 text-white rounded relative overflow-hidden"
              style={{
                ...(showParty ? { boxShadow: "0 0 32px 8px #ffe066, 0 0 8px 2px #ff6f61", filter: "brightness(1.2)" } : undefined),
              }}
              disabled={loading}
            >
              {loading ? "Removing..." : "Completed"}
              {showParty && (
                <span className="absolute inset-0 pointer-events-none animate-pulse text-yellow-300 text-2xl flex items-center justify-center">
                  ✨
                </span>
              )}
            </motion.button>
          </div>

          {!shouldReduceMotion && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{
                boxShadow: ["0 0 0px rgba(255,111,97,0)", "0 0 18px rgba(255,111,97,0.45)", "0 0 0px rgba(255,111,97,0)"]
              }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", type: "tween" }}
              style={{ position: "absolute", inset: 0, zIndex: -1, borderRadius: 8, pointerEvents: "none" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

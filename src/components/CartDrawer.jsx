"use client"
import { motion, AnimatePresence } from "framer-motion"

export default function CartDrawer({ cart, onUpdateQty, onRemove, onPlaceOrder, onSync, outboxCount }) {
  const total = cart.reduce((s, i) => s + (i.totalPrice || i.price * (i.qty || 1)), 0)

  return (
    <motion.aside
      className="border-2 border-purple-300 rounded-xl p-4 sticky top-4 bg-gradient-to-br from-white to-purple-50 shadow-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
        type: "tween"
      }}
    >
      <motion.h2
        className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          scale: [1, 1.02, 1],
        }}
        transition={{
          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear", type: "tween" },
          scale: { duration: 2, repeat: Infinity, type: "tween" },
        }}
        style={{ backgroundSize: "200% 200%" }}
      >
        🛒 Cart
      </motion.h2>

      <div role="list" className="max-h-96 overflow-auto space-y-2">
        <AnimatePresence>
          {cart.length === 0 && (
            <motion.div
              className="text-sm text-gray-500 text-center py-4"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.5, 1, 0.5],
                y: [0, -2, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 2, repeat: Infinity, type: "tween" },
                y: { duration: 2, repeat: Infinity, type: "tween" },
              }}
            >
              🛒 Cart is empty
            </motion.div>
          )}
          {cart.map((item, index) => (
            <motion.div
              key={item._uid}
              role="listitem"
              className="flex items-center gap-3 border border-purple-200 rounded-lg p-3 bg-white/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                delay: index * 0.1,
                type: "tween",
                duration: 0.35
              }}
            >
              <motion.img
                src={item.image || "/images/vegburger.png"}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg border-2 border-purple-200"
                animate={{
                  borderColor: ["#a855f7", "#3b82f6", "#a855f7"],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  borderColor: { duration: 2, repeat: Infinity, type: "tween", ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, type: "tween" },
                }}
              />
              <div className="flex-1">
                <motion.div
                  className="font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    type: "tween",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  {item.name}
                </motion.div>
                <div className="text-sm text-gray-600">{item.modifiers?.map((m) => m.name).join(", ")}</div>
                <motion.div
                  className="text-sm font-bold text-green-600"
                  animate={{
                    scale: [1, 1.05, 1],
                    color: ["#059669", "#10b981", "#059669"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    type: "tween"
                  }}
                >
                  ₹{item.totalPrice}
                </motion.div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => onUpdateQty(item._uid, Math.max(1, item.qty - 1))}
                    aria-label="decrease"
                    className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-bold shadow-md"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "tween" }}
                  >
                    -
                  </motion.button>
                  <motion.div
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg font-bold"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      type: "tween"
                    }}
                  >
                    {item.qty}
                  </motion.div>
                  <motion.button
                    onClick={() => onUpdateQty(item._uid, item.qty + 1)}
                    aria-label="increase"
                    className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-bold shadow-md"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "tween" }}
                  >
                    +
                  </motion.button>
                </div>
                <motion.button
                  onClick={() => onRemove(item._uid)}
                  className="text-xs text-red-600 font-semibold hover:text-red-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    color: ["#dc2626", "#ef4444", "#dc2626"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    type: "tween"
                  }}
                >
                  🗑️ Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-4 pt-3 border-t-2 border-purple-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, type: "tween" }}
      >
        <div className="flex justify-between mb-3">
          <motion.div
            className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              scale: [1, 1.05, 1],
            }}
            transition={{
              backgroundPosition: { duration: 2, repeat: Infinity, type: "tween" },
              scale: { duration: 2, repeat: Infinity, type: "tween" },
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Total
          </motion.div>
          <motion.div
            className="font-bold text-lg text-green-600"
            animate={{
              scale: [1, 1.1, 1],
              color: ["#059669", "#10b981", "#059669"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              type: "tween"
            }}
          >
            ₹{total.toFixed(2)}
          </motion.div>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={() => onPlaceOrder()}
            disabled={cart.length === 0}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={
              cart.length > 0
                ? {
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(34, 197, 94, 0.6)",
                  rotate: [0, -1, 1, 0],
                  transition: { type: "tween", duration: 0.6 }
                }
                : {}
            }
            whileTap={cart.length > 0 ? { scale: 0.95 } : {}}
            animate={
              cart.length > 0
                ? {
                  boxShadow: [
                    "0 4px 20px rgba(34, 197, 94, 0.3)",
                    "0 4px 30px rgba(34, 197, 94, 0.5)",
                    "0 4px 20px rgba(34, 197, 94, 0.3)",
                  ],
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }
                : {}
            }
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, type: "tween" },
              backgroundPosition: { duration: 3, repeat: Infinity, type: "tween" },
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            🚀 Place Order
          </motion.button>
          <motion.button
            onClick={() => onSync()}
            className="px-4 py-3 border-2 border-purple-400 rounded-lg font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: ["#a855f7", "#3b82f6", "#a855f7"],
              boxShadow: [
                "0 2px 10px rgba(139, 92, 246, 0.2)",
                "0 2px 15px rgba(139, 92, 246, 0.3)",
                "0 2px 10px rgba(139, 92, 246, 0.2)",
              ],
            }}
            transition={{
              borderColor: { duration: 2, repeat: Infinity, type: "tween" },
              boxShadow: { duration: 2, repeat: Infinity, type: "tween" },
            }}
          >
            🔄 Sync {outboxCount > 0 && <span className="ml-1 text-red-600 font-bold">({outboxCount})</span>}
          </motion.button>
        </div>
      </motion.div>
    </motion.aside>
  )
}

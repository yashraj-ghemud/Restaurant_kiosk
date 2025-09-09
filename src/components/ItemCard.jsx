"use client"
import { motion } from "framer-motion"

export default function ItemCard({ item, onOpen }) {
  return (
    <motion.div
      className="border-2 border-transparent rounded-xl p-4 flex flex-col bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
      role="article"
      aria-label={item.name}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        borderColor: "#8b5cf6",
        // use tween transition for multi-keyframe rotate
        rotate: [0, -1, 1, 0],
        transition: { type: "tween", duration: 0.6, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: [
          "0 4px 15px rgba(139, 92, 246, 0.1)",
          "0 4px 20px rgba(139, 92, 246, 0.2)",
          "0 4px 15px rgba(139, 92, 246, 0.1)",
        ],
      }}
      transition={{
        type: "tween",
        duration: 2,
        // boxShadow tween repetition
        boxShadow: { duration: 2, repeat: Infinity, ease: "linear" },
      }}
    >
      <motion.img
        src={item.image}
        alt={item.name}
        className="h-32 w-full object-cover rounded-lg mb-3 shadow-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
        }}
        transition={{
          duration: 0.5,
          filter: { duration: 3, repeat: Infinity, type: "tween", ease: "linear" },
        }}
        whileHover={{
          scale: 1.05,
          filter: "brightness(1.2) saturate(1.1)",
          transition: { type: "tween", duration: 0.25 },
        }}
      />
      <div className="flex justify-between items-start mb-3">
        <div>
          <motion.h3
            className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              type: "tween",
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {item.name}
          </motion.h3>
          <motion.div
            className="text-sm font-medium"
            animate={{
              color: ["#6b7280", "#8b5cf6", "#3b82f6", "#6b7280"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              type: "tween",
            }}
          >
            {item.category}
          </motion.div>
        </div>
        <motion.div
          className="text-right"
          animate={{
            scale: [1, 1.05, 1],
            color: ["#059669", "#10b981", "#059669"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            type: "tween",
          }}
        >
          <div className="font-bold text-lg text-green-600">₹{item.price}</div>
        </motion.div>
      </div>
      <motion.button
        className="mt-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-300"
        onClick={() => onOpen(item)}
        aria-label={`Customize ${item.name}`}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
          rotate: [0, -2, 2, 0],
          transition: { type: "tween", duration: 0.6, ease: "easeInOut" },
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 4px 15px rgba(139, 92, 246, 0.3)",
            "0 4px 20px rgba(139, 92, 246, 0.5)",
            "0 4px 15px rgba(139, 92, 246, 0.3)",
          ],
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          type: "tween",
          duration: 3,
          repeat: Infinity,
        }}
        style={{ backgroundSize: "200% 200%" }}
      >
        ✨ Add to Cart
      </motion.button>
    </motion.div>
  )
}

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE } from "../data/content";

export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${SITE.phoneRaw}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-white font-semibold text-sm shadow-lg shadow-[#25D366]/30 hover:bg-[#1fb855] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </motion.a>
  );
}

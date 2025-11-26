import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ChatWindow from './ChatWindow';
import { MessageCircle, X } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="chat-button"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="close-button"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => setIsOpen(false)}
                className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pulse animation ring */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 z-40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.75, 0, 0.75],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </>
  );
};

export default ChatWidget;
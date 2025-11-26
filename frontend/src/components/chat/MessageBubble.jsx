import { motion } from 'framer-motion';
import { Bot, User, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AGENT_CONFIG = {
  clinic: {
    color: 'bg-blue-100 text-blue-800',
    gradient: 'from-blue-500 to-blue-600',
    badge: 'Assistant',
    icon: Bot,
  },
  appointment: {
    color: 'bg-purple-100 text-purple-800',
    gradient: 'from-purple-500 to-purple-600',
    badge: 'Scheduler',
    icon: Calendar,
  },
  treatment: {
    color: 'bg-green-100 text-green-800',
    gradient: 'from-green-500 to-green-600',
    badge: 'Recommender',
    icon: Sparkles,
  },
};

const MessageBubble = ({ message, isBot, agent = 'clinic' }) => {
  const config = AGENT_CONFIG[agent] || AGENT_CONFIG.clinic;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-2 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot 
          ? `bg-gradient-to-r ${config.gradient}` 
          : 'bg-gray-200'
      }`}>
        {isBot ? (
          <Icon className="h-5 w-5 text-white" />
        ) : (
          <User className="h-5 w-5 text-gray-600" />
        )}
      </div>
      
      <div className="flex flex-col space-y-1 max-w-[75%]">
        {isBot && (
          <Badge variant="secondary" className={`${config.color} w-fit text-xs px-2 py-0.5`}>
            {config.badge}
          </Badge>
        )}
        <div className={`rounded-2xl px-4 py-2 ${
          isBot 
            ? config.color
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
import React, { memo } from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import AvatarWithStatus from '../common/AvatarWithStatus';
import { Chat } from '../../types';
import { formatChatTime, truncate } from '../../utils/formatters';

interface Props {
  chat:        Chat;
  isActive:    boolean;
  currentUid:  string;
  isOnline:    boolean;
  onClick:     () => void;
}

const ChatListItem: React.FC<Props> = memo(({ chat, isActive, currentUid, isOnline, onClick }) => {
  const otherParticipant = Object.values(chat.participantDetails).find(
    (p) => p.uid !== currentUid,
  );
  const displayName  = chat.type === 'direct' ? (otherParticipant?.displayName ?? chat.name) : chat.name;
  const displayPhoto = chat.type === 'direct' ? (otherParticipant?.photoURL ?? null) : chat.photoURL;
  const displayUid   = chat.type === 'direct' ? (otherParticipant?.uid ?? chat.id) : chat.id;

  const lastMsg   = chat.lastMessage;
  const timeLabel = lastMsg ? formatChatTime(lastMsg.createdAt) : '';
  const preview   = lastMsg
    ? (lastMsg.senderId === currentUid ? `You: ${lastMsg.content}` : lastMsg.content)
    : 'No messages yet';

  const typingUserIds = Object.entries(chat.typingUsers ?? {})
    .filter(([uid, isTyping]) => isTyping && uid !== currentUid)
    .map(([uid]) => uid);

  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-950/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
      `}
      style={{ outline: 'none', border: 'none', background: isActive ? undefined : 'transparent', cursor: 'pointer' }}
      aria-selected={isActive}
    >
      <AvatarWithStatus
        uid={displayUid}
        displayName={displayName}
        photoURL={displayPhoto}
        isOnline={isOnline}
        size={44}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'text.primary', fontSize: '0.875rem', fontWeight: chat.unreadCount > 0 ? 700 : 500 }}
          >
            {displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0, fontSize: '0.7rem' }}>
            {timeLabel}
          </Typography>
        </div>

        <div className="flex items-center justify-between gap-1 mt-0.5">
          <Typography
            variant="caption"
            noWrap
            sx={{
              color:      typingUserIds.length > 0 ? 'primary.main' : 'text.secondary',
              fontStyle:  typingUserIds.length > 0 ? 'italic' : 'normal',
              fontWeight: chat.unreadCount > 0 ? 600 : 400,
              fontSize:   '0.78rem',
            }}
          >
            {typingUserIds.length > 0 ? 'typing…' : truncate(preview, 40)}
          </Typography>

          {chat.unreadCount > 0 && (
            <Box
              component="span"
              sx={{
                display:    'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor:   'primary.main',
                color:     'white',
                borderRadius: '50%',
                minWidth:  18,
                height:    18,
                fontSize:  '0.65rem',
                fontWeight: 700,
                px: 0.5,
                flexShrink: 0,
              }}
            >
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </Box>
          )}
        </div>
      </div>
    </motion.button>
  );
});

ChatListItem.displayName = 'ChatListItem';
export default ChatListItem;

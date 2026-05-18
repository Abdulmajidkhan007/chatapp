import React from 'react';
import { Box, Typography, IconButton, Tooltip, Divider, Avatar } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatList from '../chat/ChatList';
import ThemeToggle from '../common/ThemeToggle';
import { Chat, AppUser } from '../../types';
import { getAvatarColor } from '../../utils/colors';
import { getInitials } from '../../utils/formatters';

interface Props {
  user:          AppUser;
  chats:         Chat[];
  activeChatId:  string | null;
  loading:       boolean;
  error:         string | null;
  onlineUsers:   Record<string, boolean>;
  onSelectChat:  (chatId: string) => void;
  onNewChat?:    () => void;
  onSignOut:     () => void;
  onRetryChats?: () => void;
}

const Sidebar: React.FC<Props> = ({
  user,
  chats,
  activeChatId,
  loading,
  error,
  onlineUsers,
  onSelectChat,
  onNewChat,
  onSignOut,
  onRetryChats,
}) => {
  return (
    <Box
      component="aside"
      className="flex flex-col h-full"
      sx={{ bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}
    >
      {/* Header */}
      <Box className="flex items-center justify-between px-4 py-3 gap-2" sx={{ minHeight: 64, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ letterSpacing: '-0.3px', fontWeight: 700 }}>
          Messages
        </Typography>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onNewChat && (
            <Tooltip title="New conversation">
              <IconButton size="small" onClick={onNewChat} aria-label="New conversation">
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Box>

      <Divider />

      {/* Chat list - flex-1 */}
      <Box className="flex-1 overflow-hidden">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          currentUid={user.uid}
          loading={loading}
          error={error}
          onlineUsers={onlineUsers}
          onSelectChat={onSelectChat}
          onRetry={onRetryChats}
        />
      </Box>

      <Divider />

      {/* User footer */}
      <Box className="flex items-center gap-3 px-3 py-3">
        <Avatar
          src={user.photoURL ?? undefined}
          sx={{ width: 36, height: 36, bgcolor: getAvatarColor(user.uid), fontWeight: 600, fontSize: '0.875rem' }}
        >
          {!user.photoURL && getInitials(user.displayName)}
        </Avatar>
        <div className="flex-1 min-w-0">
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {user.displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        </div>
        <Tooltip title="Sign out">
          <IconButton size="small" onClick={onSignOut} sx={{ color: 'text.secondary' }} aria-label="Sign out">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;

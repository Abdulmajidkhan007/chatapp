import React from 'react';
import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { AnimatePresence, motion } from 'framer-motion';
import ChatList from '../chat/ChatList';
import ThemeToggle from '../common/ThemeToggle';
import SettingsPanel from './SettingsPanel';
import { useAppSelector } from '../../app/hooks';
import { Chat, AppUser } from '../../types';

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
  const activePanel = useAppSelector((s) => s.ui.activePanel);

  return (
    <Box
      component="aside"
      className="flex flex-col h-full relative overflow-hidden"
      sx={{ bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {activePanel === 'settings' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{    opacity: 0, x: 40 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SettingsPanel />
          </motion.div>
        ) : (
          <motion.div
            key="chats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{    opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Header */}
            <Box
              className="flex items-center justify-between px-4 py-3 gap-2"
              sx={{ minHeight: 64, flexShrink: 0 }}
            >
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
                <Tooltip title="Sign out">
                  <IconButton
                    size="small"
                    onClick={onSignOut}
                    sx={{ color: 'text.secondary' }}
                    aria-label="Sign out"
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </Box>

            <Divider />

            {/* Chat list */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Sidebar;

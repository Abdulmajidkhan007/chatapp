import React from 'react';
import { IconButton, Typography, Tooltip, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AvatarWithStatus from '../common/AvatarWithStatus';
import StatusBadge from '../common/StatusBadge';
import { Chat } from '../../types';

interface Props {
  chat:             Chat;
  currentUid:       string;
  isOnline:         boolean;
  onMenuClick:      () => void;
  showMenuButton:   boolean;
}

const ChatHeader: React.FC<Props> = ({
  chat,
  currentUid,
  isOnline,
  onMenuClick,
  showMenuButton,
}) => {
  const other = Object.values(chat.participantDetails).find((p) => p.uid !== currentUid);
  const displayName  = chat.type === 'direct' ? (other?.displayName ?? chat.name) : chat.name;
  const displayPhoto = chat.type === 'direct' ? (other?.photoURL ?? null) : chat.photoURL;
  const displayUid   = chat.type === 'direct' ? (other?.uid ?? chat.id) : chat.id;

  return (
    <Box
      component="header"
      className="flex items-center gap-3 px-4 py-3 border-b"
      sx={{
        bgcolor:     'background.paper',
        borderColor: 'divider',
        minHeight:   64,
        flexShrink:  0,
      }}
    >
      {showMenuButton && (
        <IconButton onClick={onMenuClick} size="small" edge="start" aria-label="Open sidebar">
          <MenuIcon />
        </IconButton>
      )}

      <AvatarWithStatus
        uid={displayUid}
        displayName={displayName}
        photoURL={displayPhoto}
        isOnline={isOnline}
        size={40}
      />

      <div className="flex-1 min-w-0">
        <Typography variant="subtitle1" noWrap sx={{ lineHeight: 1.2, fontWeight: 600 }}>
          {displayName}
        </Typography>
        <StatusBadge isOnline={isOnline} size="small" />
      </div>

      <div className="flex items-center gap-0.5">
        <Tooltip title="Voice call (coming soon)">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <CallOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video call (coming soon)">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <VideocamOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More options">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </Box>
  );
};

export default ChatHeader;

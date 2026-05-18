import React from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSidebarOpen } from '../../features/ui/uiSlice';

const SIDEBAR_WIDTH = 320;

interface Props {
  sidebar:  React.ReactNode;
  main:     React.ReactNode;
}

const AppShell: React.FC<Props> = ({ sidebar, main }) => {
  const dispatch      = useAppDispatch();
  const sidebarOpen   = useAppSelector((s) => s.ui.sidebarOpen);
  const theme         = useTheme();
  const isMobile      = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => dispatch(setSidebarOpen(false));

  return (
    <Box
      className="flex h-screen w-full overflow-hidden"
      sx={{ bgcolor: 'background.default' }}
    >
      {/* Desktop persistent sidebar */}
      {!isMobile && (
        <motion.div
          initial={false}
          style={{ width: SIDEBAR_WIDTH, flexShrink: 0, height: '100%' }}
        >
          {sidebar}
        </motion.div>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          open={sidebarOpen}
          onClose={handleClose}
          variant="temporary"
          slotProps={{
            backdrop: {},
            paper: {
              sx: {
                width:    SIDEBAR_WIDTH,
                maxWidth: '85vw',
                borderRight: 'none',
              },
            },
          }}
        >
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -SIDEBAR_WIDTH }}
                animate={{ x: 0 }}
                exit={{    x: -SIDEBAR_WIDTH }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ height: '100%' }}
              >
                {sidebar}
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer>
      )}

      {/* Main content */}
      <Box component="main" className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {main}
      </Box>
    </Box>
  );
};

export default AppShell;

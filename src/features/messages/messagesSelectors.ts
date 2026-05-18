// src/features/messages/messagesSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export const selectMessagesByChatId = (chatId: string) => (s: RootState) =>
  s.messages.messagesByChatId[chatId] ?? [];

export const selectMessagesLoadingByChatId = (chatId: string) => (s: RootState) =>
  s.messages.loadingByChatId[chatId] ?? false;

export const selectMessagesErrorByChatId = (chatId: string) => (s: RootState) =>
  s.messages.errorByChatId[chatId] ?? null;

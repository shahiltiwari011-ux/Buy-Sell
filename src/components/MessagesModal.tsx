import React, { useState } from 'react';
import type { MessageThread } from '../types';
import { X, Send, MessageCircle, ShieldCheck } from 'lucide-react';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  threads: MessageThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const currentThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentThread) return;
    onSendMessage(currentThread.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl h-[600px] max-h-[90vh] bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E2F952] border-2 border-black flex items-center justify-center text-black">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Campus Messages</h3>
              <p className="text-xs text-slate-500 font-medium">Direct chats with student sellers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-black flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Threads Sidebar */}
          <div className="w-1/3 border-r-2 border-black overflow-y-auto bg-slate-50/50 hidden sm:block">
            {threads.map((thread) => {
              const isSelected = thread.id === currentThread?.id;
              return (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full p-3.5 text-left border-b border-slate-200 transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected ? 'bg-[#E2F952]/40 font-bold' : 'hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={thread.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
                    alt={thread.sellerName}
                    className="w-9 h-9 rounded-full object-cover border border-black shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">{thread.sellerName}</span>
                      <span className="text-[10px] text-slate-400">{thread.time}</span>
                    </div>
                    {thread.productTitle && (
                      <p className="text-[11px] font-semibold text-slate-500 truncate">{thread.productTitle}</p>
                    )}
                    <p className="text-xs text-slate-600 truncate">{thread.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Chat Conversation Area */}
          <div className="flex-1 flex flex-col bg-white">
            {currentThread ? (
              <>
                {/* Active thread header */}
                <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentThread.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
                      alt={currentThread.sellerName}
                      className="w-8 h-8 rounded-full object-cover border border-black"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-1">
                        {currentThread.sellerName}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {currentThread.productTitle ? `Item: ${currentThread.productTitle}` : 'Verified Student'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCFBF7]">
                  {currentThread.messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            isUser
                              ? 'bg-[#E2F952] text-black rounded-tr-xs'
                              : 'bg-white text-slate-900 rounded-tl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {msg.time}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Input form */}
                <form onSubmit={handleSend} className="p-3 border-t-2 border-black bg-white flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message for campus pickup..."
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-black text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-slate-50"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-black text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-sm">
                Select a conversation on the left to start chatting.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Search, ArrowLeft, MoreVertical, Image as ImageIcon, MessageSquarePlus, MessageCircle } from "lucide-react"

export default function Messages({ onClose, initialChat }) {
  const [conversations, setConversations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campushub_conversations") || "[]")
    } catch {
      return []
    }
  })
  const [activeChat, setActiveChat] = useState(null)
  const [inputText, setInputText] = useState("")

  // Store messages per conversation ID
  const [messagesMap, setMessagesMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campushub_messages_map") || "{}")
    } catch {
      return {}
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("campushub_conversations", JSON.stringify(conversations))
    } catch {}
  }, [conversations])

  useEffect(() => {
    try {
      localStorage.setItem("campushub_messages_map", JSON.stringify(messagesMap))
    } catch {}
  }, [messagesMap])

  // Handle incoming initialChat when user clicks "Contact Author" on a post
  useEffect(() => {
    if (initialChat) {
      const chatId = initialChat.id || initialChat.username || Date.now()
      const existingConv = conversations.find(c => c.id === chatId)
      
      const convObj = existingConv || {
        id: chatId,
        sender: initialChat.authorName || initialChat.sender || "Campus Student",
        username: initialChat.username || "student",
        lastMessage: "Conversation started from post...",
        time: "Just now",
        unread: false,
      }

      if (!existingConv) {
        setConversations(prev => [convObj, ...prev])
      }

      // Set default initial greeting message if empty
      if (!messagesMap[chatId]) {
        setMessagesMap(prev => ({
          ...prev,
          [chatId]: [
            { id: 1, text: `Hi! I saw your post "${initialChat.title || 'on Campus Pulse'}" and wanted to reach out.`, sender: "me", time: "Just now" }
          ]
        }))
      }

      setActiveChat(convObj)
    }
  }, [initialChat])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim() || !activeChat) return

    const chatId = activeChat.id
    const newMsg = {
      id: Date.now(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Update message history for active chat
    setMessagesMap(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }))

    // Update last message in conversation list
    setConversations(prev => prev.map(c => 
      c.id === chatId ? { ...c, lastMessage: inputText, time: "Just now" } : c
    ))

    setInputText("")
  }

  // Active Chat / Conversation Screen
  if (activeChat) {
    const currentMessages = messagesMap[activeChat.id] || []

    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)] campushub-card rounded-3xl border border-blue-500/25 overflow-hidden text-white shadow-2xl animate-in slide-in-from-right-4 duration-300">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-blue-500/20 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveChat(null)} 
              className="p-1.5 -ml-2 rounded-full hover:bg-blue-600/20 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar className="w-9 h-9 border border-blue-400/40">
              <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                {(activeChat.sender || "Student").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-white">{activeChat.sender}</span>
              <span className="text-[10px] text-blue-300 mt-0.5">@{activeChat.username}</span>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-blue-300/70 my-4">
            Direct Campus Message
          </div>
          
          {currentMessages.length === 0 ? (
            <div className="text-center text-xs text-slate-400 py-10">
              Send a message to start the conversation!
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm font-medium ${
                    msg.sender === "me" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-md" 
                      : "bg-slate-900/90 text-white border border-blue-500/25 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 font-medium">{msg.time}</span>
              </div>
            ))
          )}
        </div>

        {/* Chat Input Field */}
        <div className="p-3 border-t border-blue-500/20 bg-slate-900/90">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-blue-400 transition-colors bg-blue-950/50 rounded-full cursor-pointer">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder={`Message ${activeChat.sender}...`} 
              className="flex-1 bg-slate-950/80 border border-blue-500/30 text-white placeholder:text-slate-500 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Inbox List Screen
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] campushub-card rounded-3xl border border-blue-500/25 overflow-hidden text-white shadow-2xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-blue-500/20 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 -ml-2 rounded-full hover:bg-blue-600/20 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-purple-400" /> Direct Messages
          </h2>
        </div>
      </div>

      {/* Inbox Contents */}
      {conversations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1">No Messages Yet</h3>
          <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
            Go to the <b className="text-white">Campus Pulse</b> feed and click <b className="text-cyan-300">"Contact Author"</b> on any post to message a student directly!
          </p>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-xs font-bold bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all cursor-pointer"
            >
              Explore Campus Feed
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pt-3 space-y-2">
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              onClick={() => setActiveChat(conv)}
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/40 cursor-pointer transition-colors border border-blue-500/20 hover:border-blue-400/40"
            >
              <Avatar className="w-12 h-12 border border-blue-400/30">
                <AvatarFallback className="bg-blue-600 text-white font-black">
                  {conv.sender.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-bold truncate text-white">
                    {conv.sender}
                  </p>
                  <span className="text-[10px] shrink-0 text-slate-400 font-medium">
                    {conv.time}
                  </span>
                </div>
                <p className="text-xs truncate text-slate-300 font-medium">
                  {conv.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

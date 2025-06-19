"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Settings, 
  User 
} from "lucide-react";
import { BitNetStatus } from "../BitNet/BitNetStatus";

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-950/30 border-r border-gray-800/30 flex flex-col backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <h1 className="text-xl font-semibold text-white mb-4">BitNet Chat</h1>
        
        {/* New Chat Button */}
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search your threads..."
            className="pl-10 bg-gray-900/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-4">
        <div className="text-center py-8">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-600" />
          <p className="text-sm text-gray-500">
            No hay conversaciones aún
          </p>
        </div>
      </ScrollArea>

      {/* BitNet Status */}
      <div className="p-4 border-t border-gray-800/50">
        <BitNetStatus />
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
} 
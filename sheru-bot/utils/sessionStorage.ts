export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  emotionHistory: Array<{
    timestamp: number;
    emotion: string;
    confidence: number;
  }>;
  totalSamples: number;
  emotionCounts: {
    happy: number;
    neutral: number;
    sad: number;
    angry: number;
    surprised: number;
    fearful: number;
    disgusted: number;
  };
  gazeReminders: number;
  conversationDuration: number;
}

export interface SessionStats {
  totalSessions: number;
  totalDuration: number;
  averageEmotions: Record<string, number>;
  recentSessions: SessionData[];
}

export const SessionStorage = {
  // Save current session data
  saveSession(sessionData: SessionData): void {
    try {
      const sessions = this.getAllSessions();
      sessions.push(sessionData);
      localStorage.setItem('mimi_sessions', JSON.stringify(sessions));
      console.log('[SessionStorage] ✅ Session saved:', sessionData.sessionId);
    } catch (error) {
      console.error('[SessionStorage] ❌ Failed to save session:', error);
    }
  },

  // Get all sessions
  getAllSessions(): SessionData[] {
    try {
      const data = localStorage.getItem('mimi_sessions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[SessionStorage] ❌ Failed to load sessions:', error);
      return [];
    }
  },

  // Get session statistics
  getSessionStats(): SessionStats {
    const sessions = this.getAllSessions();
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageEmotions: {},
        recentSessions: [],
      };
    }

    const totalDuration = sessions.reduce((sum, s) => sum + (s.conversationDuration || 0), 0);
    
    // Calculate average emotion percentages across all sessions
    const totalEmotionCounts = sessions.reduce((acc, session) => {
      Object.entries(session.emotionCounts).forEach(([emotion, count]) => {
        acc[emotion] = (acc[emotion] || 0) + count;
      });
      return acc;
    }, {} as Record<string, number>);

    // Calculate total samples and average emotions
    const emotionEntries = Object.entries(totalEmotionCounts);
    const totalSamples: number = emotionEntries.reduce((sum: number, [, count]) => sum + (count as number), 0);
    
    const averageEmotions: Record<string, number> = {};
    emotionEntries.forEach(([emotion, count]) => {
      if (totalSamples > 0) {
        averageEmotions[emotion] = ((count as number) / totalSamples) * 100;
      } else {
        averageEmotions[emotion] = 0;
      }
    });

    return {
      totalSessions: sessions.length,
      totalDuration,
      averageEmotions,
      recentSessions: sessions.slice(-5), // Last 5 sessions
    };
  },

  // Clear all sessions (for testing)
  clearAllSessions(): void {
    localStorage.removeItem('mimi_sessions');
    console.log('[SessionStorage] 🗑️ All sessions cleared');
  },
};
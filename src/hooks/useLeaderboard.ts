"use client"

import { useState, useEffect, useCallback } from "react"
import type { LeaderboardEntry } from "../types/game"

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const STORAGE_KEY = "simon-leaderboard"

  const fetchLeaderboard = useCallback(() => {
    try {
      setLoading(true)
      const stored = localStorage.getItem(STORAGE_KEY)
      const leaderboard = stored ? JSON.parse(stored) : []
      // Sort by score descending and limit to top 10
      const sorted = leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score).slice(0, 10)
      setEntries(sorted)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  const saveScore = useCallback(
    (playerName: string, score: number) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const leaderboard = stored ? JSON.parse(stored) : []

        const newEntry: LeaderboardEntry = {
          id: `${Date.now()}-${Math.random()}`,
          player_name: playerName,
          score: score,
          created_at: new Date().toISOString(),
        }

        leaderboard.push(newEntry)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard))

        // Refresh the leaderboard display
        fetchLeaderboard()
      } catch (error) {
        console.error("Error saving score:", error)
      }
    },
    [fetchLeaderboard],
  )

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return { entries, loading, saveScore }
}

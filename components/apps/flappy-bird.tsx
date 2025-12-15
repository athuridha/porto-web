"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface Box {
  x: number
  y: number
  velocity: number
}

interface Pipe {
  x: number
  topHeight: number
  bottomY: number
  passed: boolean
}

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [box, setBox] = useState<Box>({ x: 100, y: 200, velocity: 0 })
  const [pipes, setPipes] = useState<Pipe[]>([])
  const gameLoopRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)

  // Game constants
  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 600
  const BOX_SIZE = 20
  const PIPE_WIDTH = 60
  const PIPE_GAP = 150
  const GRAVITY = 0.5
  const JUMP_FORCE = -8
  const PIPE_SPEED = 2

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("kotak-loncat-high-score")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }
  }, [])

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("kotak-loncat-high-score", score.toString())
    }
  }, [score, highScore])

  const resetGame = useCallback(() => {
    setBox({ x: 100, y: 200, velocity: 0 })
    setPipes([])
    setScore(0)
    lastTimeRef.current = 0
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    setGameState("playing")
  }, [resetGame])

  const jump = useCallback(() => {
    if (gameState === "playing") {
      setBox((prev) => ({ ...prev, velocity: JUMP_FORCE }))
    } else if (gameState === "menu" || gameState === "gameOver") {
      startGame()
    }
  }, [gameState, startGame])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [jump])

  // Collision detection
  const checkCollision = useCallback((box: Box, pipes: Pipe[]) => {
    // Ground and ceiling collision
    if (box.y + BOX_SIZE >= CANVAS_HEIGHT || box.y <= 0) {
      return true
    }

    // Pipe collision
    for (const pipe of pipes) {
      if (
        box.x + BOX_SIZE > pipe.x &&
        box.x < pipe.x + PIPE_WIDTH &&
        (box.y < pipe.topHeight || box.y + BOX_SIZE > pipe.bottomY)
      ) {
        return true
      }
    }

    return false
  }, [])

  // Game loop
  const gameLoop = useCallback(
    (currentTime: number) => {
      if (gameState !== "playing") return

      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      if (deltaTime < 16) {
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      setBox((prevBox) => {
        const newBox = {
          ...prevBox,
          velocity: prevBox.velocity + GRAVITY,
          y: prevBox.y + prevBox.velocity,
        }

        setPipes((prevPipes) => {
          let newPipes = [...prevPipes]

          // Move pipes
          newPipes = newPipes.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))

          // Remove off-screen pipes
          newPipes = newPipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0)

          // Add new pipes
          if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 200) {
            const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50
            newPipes.push({
              x: CANVAS_WIDTH,
              topHeight,
              bottomY: topHeight + PIPE_GAP,
              passed: false,
            })
          }

          // Check for scoring
          newPipes = newPipes.map((pipe) => {
            if (!pipe.passed && pipe.x + PIPE_WIDTH < newBox.x) {
              setScore((prev) => prev + 1)
              return { ...pipe, passed: true }
            }
            return pipe
          })

          // Check collision
          if (checkCollision(newBox, newPipes)) {
            setGameState("gameOver")
          }

          return newPipes
        })

        return newBox
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    },
    [gameState, checkCollision],
  )

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#87CEEB"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw pipes
    ctx.fillStyle = "#228B22"
    pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY)

      // Pipe caps
      ctx.fillStyle = "#32CD32"
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20)
      ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20)
      ctx.fillStyle = "#228B22"
    })

    // Draw box
    ctx.fillStyle = "#FF5722" // Orange box
    ctx.fillRect(box.x, box.y, BOX_SIZE, BOX_SIZE)

    // Box shadow/highlight for 3D effect
    ctx.fillStyle = "#FF7043" // Lighter orange for highlight
    ctx.fillRect(box.x, box.y, BOX_SIZE, 5)
    ctx.fillRect(box.x, box.y, 5, BOX_SIZE)

    ctx.fillStyle = "#E64A19" // Darker orange for shadow
    ctx.fillRect(box.x + BOX_SIZE - 5, box.y, 5, BOX_SIZE)
    ctx.fillRect(box.x, box.y + BOX_SIZE - 5, BOX_SIZE, 5)

    // Draw ground
    ctx.fillStyle = "#8B4513"
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20)

    // Draw score
    ctx.fillStyle = "#FFF"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 50)
  }, [box, pipes, score])

  return (
    <div className="h-full bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-yellow-400 rounded-lg shadow-2xl cursor-pointer"
          onClick={jump}
        />

        {/* Game Menu */}
        {gameState === "menu" && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
            <div className="text-center text-white p-6">
              <h1 className="text-4xl font-bold mb-4 text-yellow-400">Kotak Loncat</h1>
              <p className="text-lg mb-6">Click atau tekan SPACE untuk mulai!</p>
              <div className="text-sm mb-4">
                <p>High Score: {highScore}</p>
              </div>
              <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                Mulai Game
              </Button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
            <div className="text-center text-white p-6">
              <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over!</h2>
              <div className="text-lg mb-6">
                <p>Score: {score}</p>
                <p>High Score: {highScore}</p>
                {score === highScore && score > 0 && (
                  <p className="text-yellow-400 font-bold mt-2">🎉 New High Score! 🎉</p>
                )}
              </div>
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white font-bold">
                Main Lagi
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-white text-sm">
        <p>Click atau tekan SPACE untuk loncat</p>
        <p>Hindari pipa dan coba dapatkan skor tertinggi!</p>
      </div>
    </div>
  )
}

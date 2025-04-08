import React, { useState, useEffect } from 'react'
import { Banana, Coffee } from 'lucide-react'

const AI_LOADING_MESSAGES = [
    "Monkeys are analyzing your images... 🐵",
    "Our AI monkeys are brainstorming... 🧠",
    "One monkey spilled coffee on the keyboard... ☕",
    "The monkeys are arguing about the perfect description... 🗣️",
    "Someone brought bananas to the meeting... 🍌",
    "The monkeys are doing their final checks... ✅",
    "A monkey just discovered the copy-paste shortcut... 📋",
    "The coffee machine is working overtime... ☕",
    "Monkeys are debating color schemes... 🎨",
    "Someone found the emoji keyboard... 😅"
]

const MONKEY_ACTIONS = [
    { emoji: "🐵", action: "typing furiously" },
    { emoji: "🙈", action: "covering eyes" },
    { emoji: "🙉", action: "covering ears" },
    { emoji: "🙊", action: "covering mouth" },
    { emoji: "🐒", action: "swinging on chair" },
    { emoji: "🦍", action: "thinking deeply" }
]

interface MonkeyLoadingScreenProps {
    progress: number
}

export default function MonkeyLoadingScreen({ progress }: MonkeyLoadingScreenProps) {
    const [currentMonkeyAction, setCurrentMonkeyAction] = useState(0)
    const [chaosElements, setChaosElements] = useState([])
    const [randomMessages, setRandomMessages] = useState([])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Fade in effect
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        let messageInterval
        let monkeyInterval
        let chaosInterval

        // Select 3 random messages
        const shuffled = [...AI_LOADING_MESSAGES].sort(() => 0.5 - Math.random())
        setRandomMessages(shuffled.slice(0, 3))

        // Rotate through random messages
        messageInterval = setInterval(() => {
            setRandomMessages(prev => {
                const newMessages = [...prev]
                newMessages.shift()
                const remainingMessages = AI_LOADING_MESSAGES.filter(msg => !newMessages.includes(msg))
                if (remainingMessages.length > 0) {
                    newMessages.push(remainingMessages[Math.floor(Math.random() * remainingMessages.length)])
                }
                return newMessages
            })
        }, 3000)

        // Rotate through monkey actions
        monkeyInterval = setInterval(() => {
            setCurrentMonkeyAction(prev => (prev + 1) % MONKEY_ACTIONS.length)
        }, 2000)

        // Add random chaos elements
        chaosInterval = setInterval(() => {
            setChaosElements(prev => {
                const newElements = [...prev]
                if (newElements.length > 3) newElements.shift()
                newElements.push({
                    id: Date.now(),
                    type: Math.random() > 0.5 ? 'banana' : 'coffee',
                    position: {
                        x: Math.random() * 80 + 10,
                        y: Math.random() * 40 + 10
                    }
                })
                return newElements
            })
        }, 1500)

        return () => {
            clearInterval(messageInterval)
            clearInterval(monkeyInterval)
            clearInterval(chaosInterval)
        }
    }, [])

    return (
        <div 
            className={`flex flex-col items-center justify-center h-[400px] space-y-8 p-8 relative overflow-hidden transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Background SVG */}
            <div className="absolute inset-0 w-full h-full opacity-40">
                <img 
                    src="/monkey-loading-screen.svg" 
                    alt="Monkey Loading Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Background chaos elements - moved to bottom */}
            <div className="absolute inset-0 overflow-hidden">
                {chaosElements.map((element) => (
                    <div
                        key={element.id}
                        className="absolute animate-bounce"
                        style={{
                            left: `${element.position.x}%`,
                            top: `${element.position.y}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            zIndex: 1
                        }}
                    >
                        {element.type === 'banana' ? (
                            <Banana className="h-8 w-8 text-yellow-400 rotate-12" />
                        ) : (
                            <Coffee className="h-8 w-8 text-brown-400" />
                        )}
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-20 flex flex-col items-center space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="relative w-16 h-16 transform hover:scale-110 transition-transform"
                            style={{
                                animation: `bounce ${1 + i * 0.2}s infinite`
                            }}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"></div>
                            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center text-2xl">
                                {MONKEY_ACTIONS[currentMonkeyAction].emoji}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center space-y-4 w-full">
                    <div className="h-24 overflow-hidden">
                        {randomMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`text-xl font-semibold text-gray-900 transition-opacity duration-500 ${
                                    index === 0 ? 'opacity-100' : 'opacity-0 absolute'
                                }`}
                            >
                                {message}
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-500">
                        {MONKEY_ACTIONS[currentMonkeyAction].action}...
                    </p>

                    <p className='text-black-500'>
                       <b> Our AI monkeys are working hard to help you list your awesome new product! </b>   
                    </p>
                </div>


                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 
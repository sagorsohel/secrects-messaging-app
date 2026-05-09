import { useState } from "react"
import { Shield, Lock, Unlock, Copy, Check, ShieldAlert, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Emoji Mapping for Hex (0-F)
// Using stable emoji representations
const EMOJI_MAP: Record<string, string> = {
  "0": "🛡️", "1": "🔑", "2": "🔒", "3": "🕵️",
  "4": "🤫", "5": "🚀", "6": "💎", "7": "🌈",
  "8": "🌙", "9": "☀️", "a": "🪐", "b": "🍀",
  "c": "🦄", "d": "🐉", "e": "⚡", "f": "❄️"
}

// Reverse mapping for decryption
const REVERSE_EMOJI_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(EMOJI_MAP).map(([k, v]) => [v, k])
)

export function App() {
  const [inputText, setInputText] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const encrypt = () => {
    if (!inputText || !secretKey) {
      setError("Please provide both message and secret key")
      return
    }
    setError("")
    try {
      // 1. XOR Encryption
      const xorResult = Array.from(inputText)
        .map((_, i) => inputText.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length))
      
      // 2. Convert to Hex
      const hexResult = xorResult
        .map(b => b.toString(16).padStart(2, '0'))
        .join("")
      
      // 3. Map Hex to Emojis
      const emojiResult = hexResult
        .split("")
        .map(char => EMOJI_MAP[char] || char)
        .join("")
        
      setResult(emojiResult)
    } catch {
      setError("Encryption failed. Check your inputs.")
    }
  }

  const decrypt = () => {
    if (!inputText || !secretKey) {
      setError("Please provide both emoji message and secret key")
      return
    }
    setError("")
    try {
      // 1. Convert Emojis back to Hex
      // We use a sliding window to match emojis as some are multiple characters long
      let hexString = ""
      let i = 0
      while (i < inputText.length) {
        let matched = false
        // Try matching longest possible emoji first (max 4 characters for safety)
        for (let len = 4; len > 0; len--) {
          const part = inputText.slice(i, i + len)
          if (REVERSE_EMOJI_MAP[part]) {
            hexString += REVERSE_EMOJI_MAP[part]
            i += len
            matched = true
            break
          }
        }
        if (!matched) {
          i++ // Skip unrecognized characters (like spaces or unknown emojis)
        }
      }
      
      if (!hexString || hexString.length % 2 !== 0) {
        throw new Error("Invalid emoji sequence")
      }

      // 2. Convert Hex to Bytes
      const bytes: number[] = []
      for (let j = 0; j < hexString.length; j += 2) {
        bytes.push(parseInt(hexString.slice(j, j + 2), 16))
      }

      // 3. XOR Decryption
      const decrypted = bytes
        .map((byte, idx) => String.fromCharCode(byte ^ secretKey.charCodeAt(idx % secretKey.length)))
        .join("")
        
      setResult(decrypted)
    } catch {
      setError("Decryption failed. Invalid emoji message or secret key.")
    }
  }

  const clear = () => {
    setInputText("")
    setResult("")
    setError("")
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f8fafc] p-4 font-sans text-slate-900 selection:bg-indigo-100">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Secretly</h1>
          <p className="text-sm font-medium text-slate-500">Emoji-Powered Secure Messaging</p>
        </div>

        <Tabs defaultValue="encrypt" className="w-full" onValueChange={clear}>
          <div className="px-1">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
              <TabsTrigger 
                value="encrypt" 
                className="rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <Lock className="mr-2 h-4 w-4" />
                Encrypt
              </TabsTrigger>
              <TabsTrigger 
                value="decrypt" 
                className="rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Decrypt
              </TabsTrigger>
            </TabsList>
          </div>

          <Card className="mt-4 border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/60 overflow-hidden rounded-3xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Magic Box
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-full"
                  onClick={clear}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-slate-500 text-xs">
                Your messages are turned into emojis!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="secret" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Secret Key</Label>
                <div className="relative group">
                  <Input
                    id="secret"
                    type="password"
                    placeholder="Your unique secret key..."
                    className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl pl-10 transition-all"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  <TabsContent value="encrypt" className="m-0 border-none p-0">Original Message</TabsContent>
                  <TabsContent value="decrypt" className="m-0 border-none p-0">Emoji Cipher</TabsContent>
                </Label>
                <Textarea
                  id="message"
                  placeholder={inputText ? "" : "Type or paste your message..."}
                  className="min-h-[140px] bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 resize-none rounded-2xl transition-all p-4 text-base"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-xs font-medium bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in slide-in-from-top-1">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <TabsContent value="encrypt" className="m-0 border-none p-0">
                <Button 
                  onClick={encrypt} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  Encrypt to Emojis
                </Button>
              </TabsContent>

              <TabsContent value="decrypt" className="m-0 border-none p-0">
                <Button 
                  onClick={decrypt} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  Decrypt from Emojis
                </Button>
              </TabsContent>
            </CardContent>

            {result && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Output</span>
                    <span className="text-[10px] font-medium text-slate-400">
                       Ready to share
                    </span>
                  </div>
                  <div className="relative group">
                    <div className="bg-slate-900 rounded-2xl p-5 break-all text-lg font-medium text-white min-h-[80px] pr-14 shadow-inner">
                      {result}
                    </div>
                    <Button
                      size="icon"
                      className={`absolute top-4 right-4 h-10 w-10 rounded-xl transition-all shadow-lg ${
                        copied ? 'bg-green-500 scale-110' : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-5 w-5 text-white" /> : <Copy className="h-5 w-5 text-white" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <CardFooter className="pb-6 pt-2 justify-center">
               <p className="text-[10px] text-slate-300 font-medium">
                 ENCODING: UTF-8 XOR EMOJI-HEX
               </p>
            </CardFooter>
          </Card>
        </Tabs>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-xs font-bold text-slate-300">
            <span>🛡️</span>
            <span>🔑</span>
            <span>🔒</span>
            <span>🤫</span>
            <span>🚀</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

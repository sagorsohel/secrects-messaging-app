import { useState } from "react"
import { Shield, Lock, Unlock, Copy, Check, ShieldAlert, RotateCcw, Sparkles, Smartphone, Globe, Cpu, ExternalLink, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Emoji Mapping for Hex (0-F)
const EMOJI_MAP: Record<string, string> = {
  "0": "🛡️", "1": "🔑", "2": "🔒", "3": "🕵️",
  "4": "🤫", "5": "🚀", "6": "💎", "7": "🌈",
  "8": "🌙", "9": "☀️", "a": "🪐", "b": "🍀",
  "c": "🦄", "d": "🐉", "e": "⚡", "f": "❄️"
}

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
      const xorResult = Array.from(inputText)
        .map((_, i) => inputText.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length))
      const hexResult = xorResult
        .map(b => b.toString(16).padStart(2, '0'))
        .join("")
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
      let hexString = ""
      let i = 0
      while (i < inputText.length) {
        let matched = false
        for (let len = 4; len > 0; len--) {
          const part = inputText.slice(i, i + len)
          if (REVERSE_EMOJI_MAP[part]) {
            hexString += REVERSE_EMOJI_MAP[part]
            i += len
            matched = true
            break
          }
        }
        if (!matched) i++
      }
      if (!hexString || hexString.length % 2 !== 0) throw new Error("Invalid sequence")
      const bytes: number[] = []
      for (let j = 0; j < hexString.length; j += 2) {
        bytes.push(parseInt(hexString.slice(j, j + 2), 16))
      }
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
    <div className="min-h-svh bg-[#f8fafc] font-sans text-slate-900 selection:bg-[#00a8e1]/10">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Compact Branding & Services */}
          <div className="lg:col-span-4 order-2 lg:order-2 space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
            {/* Branding Banner */}
            <div className="w-full bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col sm:flex-row items-center gap-5 transition-transform hover:scale-[1.01]">
              <img
                src="https://level6it.com/assets/Level_6_IT-CKFkUPiu.webp"
                alt="Level 6 IT Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="hidden sm:block h-8 w-[1.5px] bg-slate-200/60" />
              <div className="flex flex-col text-center sm:text-left">
                <h2 className="text-sm font-black tracking-tight text-[#00a8e1] uppercase leading-tight">
                  Level Up Business
                </h2>
                <p className="text-[11px] font-bold text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <a href="https://level6it.com" target="_blank" rel="noreferrer" className="text-[#00a8e1] hover:underline flex items-center gap-0.5">
                    level6it.com <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </p>
              </div>
            </div>

            {/* Premium Services (Vertical Column - Compact) */}
            <div className="space-y-5">
              <div className="flex flex-col items-center sm:items-start pl-2">
                <h2 className="text-xs font-black text-[#0f172a] uppercase tracking-[0.2em] mb-2">Our Services</h2>
                <div className="h-[3px] w-8 bg-[#00a8e1] rounded-full" />
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                {[
                  {
                    title: "Apps Development",
                    desc: "Native & Cross-platform solutions.",
                    icon: <Smartphone className="h-4 w-4" />,
                    delay: "delay-200"
                  },
                  {
                    title: "Web Development",
                    desc: "Modern responsive experiences.",
                    icon: <Globe className="h-4 w-4" />,
                    delay: "delay-300"
                  },
                  {
                    title: "Custom Solution",
                    desc: "Tailored software architecture.",
                    icon: <Cpu className="h-4 w-4" />,
                    delay: "delay-400"
                  }
                ].map((service, idx) => (
                  <a
                    key={idx}
                    href="https://level6it.com/"
                    target="_blank"
                    rel="noreferrer"
                    className={`block transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${service.delay}`}
                  >
                    <Card className="border-[1.5px] border-transparent bg-white shadow-[0_10px_25px_rgba(0,0,0,0.02)] rounded-2xl p-4 text-left group hover:shadow-[0_15px_30px_rgba(0,168,225,0.06)] hover:border-[#00a8e1] transition-all duration-500 overflow-hidden relative">
                      <div className="absolute top-0 right-0 h-24 w-24 bg-[#00a8e1]/5 rounded-full -mr-8 -mt-8 transition-all group-hover:bg-[#00a8e1]/10" />

                      <div className="relative z-10 flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#00a8e1]/10 flex items-center justify-center transition-all group-hover:bg-[#00a8e1] group-hover:shadow-[0_5px_15px_rgba(0,168,225,0.2)]">
                          <div className="text-[#00a8e1] group-hover:text-white transition-colors scale-90">
                            {service.icon}
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black text-[#0f172a] tracking-tight group-hover:text-[#00a8e1] transition-colors">
                              {service.title}
                            </CardTitle>
                            <ChevronRight className="h-3 w-3 text-[#00a8e1] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </div>
                          <p className="text-slate-400 text-[10px] font-medium leading-tight mt-0.5">
                            {service.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Secretly App (Normal Size) */}
          <div className="lg:col-span-8 order-1 lg:order-1 flex flex-col items-center animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
            <div className="w-full max-w-[480px]">
              <div className="mb-8 flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00a8e1] shadow-xl shadow-[#00a8e1]/20">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Secretly</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Emoji Secure Messaging</p>
              </div>

              <Tabs defaultValue="encrypt" className="w-full" onValueChange={clear}>
                <div className="px-1">
                  <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
                    <TabsTrigger
                      value="encrypt"
                      className="rounded-lg py-2.5 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-[#00a8e1] data-[state=active]:shadow-sm"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Encrypt
                    </TabsTrigger>
                    <TabsTrigger
                      value="decrypt"
                      className="rounded-lg py-2.5 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-[#00a8e1] data-[state=active]:shadow-sm"
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Decrypt
                    </TabsTrigger>
                  </TabsList>
                </div>

                <Card className="mt-4 border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/60 overflow-hidden rounded-3xl">
                  <CardHeader className="pb-4 pt-6 px-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Magic Box
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-[#00a8e1] rounded-full"
                        onClick={clear}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-slate-500 text-xs mt-1">
                      Turn your messages into emojis instantly!
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5 px-6 pb-6">
                    <div className="space-y-2">
                      <Label htmlFor="secret" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Secret Key</Label>
                      <div className="relative group">
                        <Input
                          id="secret"
                          type="password"
                          placeholder="Your unique secret key..."
                          className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#00a8e1]/20 focus-visible:border-[#00a8e1] rounded-xl pl-10 transition-all"
                          value={secretKey}
                          onChange={(e) => setSecretKey(e.target.value)}
                        />
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#00a8e1] transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        <TabsContent value="encrypt" className="m-0 border-none p-0">Original Message</TabsContent>
                        <TabsContent value="decrypt" className="m-0 border-none p-0">Emoji Cipher</TabsContent>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={inputText ? "" : "Paste your text here..."}
                        className="min-h-[140px] bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#00a8e1]/20 focus-visible:border-[#00a8e1] resize-none rounded-2xl transition-all p-4 text-base leading-relaxed"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in slide-in-from-top-2">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <TabsContent value="encrypt" className="m-0 border-none p-0">
                      <Button
                        onClick={encrypt}
                        className="w-full bg-[#00a8e1] hover:bg-[#0096c7] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#00a8e1]/10 transition-all active:scale-[0.98]"
                      >
                        Encrypt to Emojis
                      </Button>
                    </TabsContent>

                    <TabsContent value="decrypt" className="m-0 border-none p-0">
                      <Button
                        onClick={decrypt}
                        className="w-full bg-[#00a8e1] hover:bg-[#0096c7] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#00a8e1]/10 transition-all active:scale-[0.98]"
                      >
                        Decrypt from Emojis
                      </Button>
                    </TabsContent>
                  </CardContent>

                  {result && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                      <div className="space-y-3 pt-3 border-t border-slate-50">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00a8e1]">Output Result</span>
                          <span className="text-[10px] font-bold text-slate-300">Copy & Share</span>
                        </div>
                        <div className="relative group">
                          <div className="bg-slate-900 rounded-2xl p-5 break-all text-lg font-bold text-white min-h-[80px] pr-14 shadow-xl">
                            {result}
                          </div>
                          <Button
                            size="icon"
                            className={`absolute top-4 right-4 h-10 w-10 rounded-xl transition-all shadow-lg ${copied ? 'bg-green-500 scale-110' : 'bg-[#00a8e1] hover:bg-[#0096c7]'
                              }`}
                            onClick={handleCopy}
                          >
                            {copied ? <Check className="h-5 w-5 text-white" /> : <Copy className="h-5 w-5 text-white" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 pb-12 text-center">
        <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.6em]">
          Level 6 IT • Emoji Secure Protocol • 2026
        </p>
      </footer>
    </div>
  )
}

export default App

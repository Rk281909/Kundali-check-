import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Send, Sparkles, Loader2, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export default function ChatPage() {
    const { profile, user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'नमस्ते, म तपाईंको एआई ज्योतिषी हुँ। आज म तपाईंलाई कसरी मार्गदर्शन गर्न सक्छु?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const context = {
                name: profile?.name,
                dob: profile?.dob,
                timeOfBirth: profile?.timeOfBirth,
                placeOfBirth: profile?.placeOfBirth,
                zodiacSign: profile?.zodiacSign
            };

            const response = await fetch('/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, context }),
            });

            const data = await response.json();
            
            if (data.error) {
                console.error("AI Error:", data.error);
                setMessages(prev => [...prev, { role: 'model', text: "अहिले ताराहरू धमिलो छन्। कृपया पछि फेरि प्रयास गर्नुहोस्।"}]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: data.text }]);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "केही प्राविधिक समस्या आयो। मेरो जडान अस्थायी रूपमा टुटेको छ।"}]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col pt-4">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-display font-bold">एआई ज्योतिषी (The Oracle)</h1>
            </div>

            <Card className="flex-1 bg-card/40 backdrop-blur border-primary/10 overflow-hidden flex flex-col relative">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <Avatar className="h-8 w-8 shrink-0 bg-primary/20">
                                        <Star className="h-4 w-4 m-auto text-primary" />
                                    </Avatar>
                                )}
                                <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted/50 text-foreground'
                                }`}>
                                    {msg.role === 'model' ? (
                                        <div className="markdown-body text-sm leading-relaxed prose prose-invert max-w-none">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="text-sm">{msg.text}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 justify-start">
                                <Avatar className="h-8 w-8 shrink-0 bg-primary/20">
                                    <Star className="h-4 w-4 m-auto text-primary" />
                                </Avatar>
                                <div className="rounded-2xl px-4 py-3 bg-muted/50 text-foreground flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground animate-pulse">ताराहरूसँग परामर्श गर्दै...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2 relative"
                    >
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="आफ्नो भविष्य, प्रेम, वा भाग्यको बारेमा सोध्नुहोस्..."
                            className="flex-1 rounded-full bg-background pr-12 focus-visible:ring-primary/50 border-primary/20"
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            disabled={!input.trim() || loading}
                            className="absolute right-1 top-1 h-8 w-8 rounded-full"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function HoroscopePage() {
    const { profile } = useAuth();
    const [horoscope, setHoroscope] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchHoroscope = async () => {
        if (!profile?.zodiacSign) return;
        setLoading(true);
        try {
            const response = await fetch('/api/gemini/horoscope', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sign: profile.zodiacSign }),
            });
            const data = await response.json();
            if (data.text) {
                setHoroscope(data.text);
            }
        } catch (error) {
            console.error("Error fetching horoscope:", error);
            setHoroscope("अहिले राशिफल हेर्न असमर्थ। कृपया फेरि प्रयास गर्नुहोस।");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile?.zodiacSign && !horoscope) {
            fetchHoroscope();
        }
    }, [profile]);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <header className="mb-8 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold">दैनिक राशिफल</h1>
                <p className="text-muted-foreground w-full max-w-lg">
                    {profile?.zodiacSign 
                        ? `${profile.zodiacSign} राशीको लागि एक ब्रह्माण्डीय राशिफल।` 
                        : "ब्रह्माण्डले के योजना बनाएको छ पत्ता लगाउनुहोस्। कृपया पहिले आफ्नो प्रोफाइलमा राशी सेट गर्नुहोस्।"}
                </p>
            </header>

            {!profile?.zodiacSign ? (
                <Card className="max-w-md mx-auto bg-card/50 border-primary/20 text-center">
                   <CardContent className="pt-6">
                       <p className="text-muted-foreground mb-4">व्यक्तिगत दैनिक राशिफल प्राप्त गर्न तपाईंले आफ्नो जन्म प्रोफाइल पूरा गर्नुपर्छ।</p>
                   </CardContent>
                </Card>
            ) : (
                <Card className="bg-card/40 backdrop-blur border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-xl">
                            <span>आजको राशिफल</span>
                            <Button variant="ghost" size="icon" onClick={fetchHoroscope} disabled={loading}>
                                <RefreshCcw className={`h-4 w-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[200px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="animate-pulse font-display tracking-wider">ग्रहहरूको पङ्क्तिबद्धता पढ्दै...</p>
                            </div>
                        ) : horoscope ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="markdown-body prose prose-invert prose-primary max-w-none text-foreground/90"
                            >
                                <ReactMarkdown>{horoscope}</ReactMarkdown>
                            </motion.div>
                        ) : null}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

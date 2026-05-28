import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Sparkles, Navigation, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Home() {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();

    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        dob: '',
        timeOfBirth: '',
        placeOfBirth: '',
        zodiacSign: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                dob: profile.dob || '',
                timeOfBirth: profile.timeOfBirth || '',
                placeOfBirth: profile.placeOfBirth || '',
                zodiacSign: profile.zodiacSign || '',
            });
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email || '',
                name: user.displayName || '',
                createdAt: profile?.createdAt || serverTimestamp(),
                ...formData
            }, { merge: true });
        } catch (error) {
            console.error("Error saving profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="relative inline-flex mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <Sparkles className="h-24 w-24 text-primary relative z-10" strokeWidth={1} />
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
                    आफ्नो <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ब्रह्माण्डीय भाग्य</span> पत्ता लगाउनुहोस्
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    एआई-संचालित ज्योतिष, ट्यारो अन्तर्दृष्टि, र तपाईंको आध्यात्मिक यात्रालाई मार्गदर्शन गर्न व्यक्तिगत दैनिक राशिफल।
                </p>
                <Button size="lg" className="h-12 px-8 text-lg rounded-full" onClick={() => navigate('/auth')}>
                    आफ्नो यात्रा सुरु गर्नुहोस्
                </Button>
            </div>
        );
    }

    const zodiacSigns = [
        "मेष (Aries)", "वृष (Taurus)", "मिथुन (Gemini)", "कर्कट (Cancer)", "सिंह (Leo)", "कन्या (Virgo)", 
        "तुला (Libra)", "वृश्चिक (Scorpio)", "धनु (Sagittarius)", "मकर (Capricorn)", "कुम्भ (Aquarius)", "मीन (Pisces)"
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-display font-bold tracking-tight">स्वागत छ, {profile?.name || 'Traveler'}</h1>
                <p className="text-muted-foreground">तपाईंको ब्रह्माण्डीय खाका पर्खिरहेको छ। गहिरो अन्तर्दृष्टि अनलक गर्न आफ्नो प्रोफाइल मिलाउनुहोस्।</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Navigation className="h-5 w-5 text-primary" />
                            जन्म कुण्डली प्रोफाइल
                        </CardTitle>
                        <CardDescription>सही कुण्डली र पङ्क्तिबद्धताका लागि आफ्नो सही जन्म विवरण प्रविष्ट गर्नुहोस्।</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="dob">जन्म मिति (Date of Birth)</Label>
                            <Input 
                                id="dob" 
                                type="date" 
                                value={formData.dob}
                                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeOfBirth">जन्म समय (Time of Birth)</Label>
                            <Input 
                                id="timeOfBirth" 
                                type="time" 
                                value={formData.timeOfBirth}
                                onChange={(e) => setFormData({...formData, timeOfBirth: e.target.value})}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="placeOfBirth">जन्म स्थान (शहर, देश)</Label>
                            <Input 
                                id="placeOfBirth" 
                                placeholder="जस्तै: काठमाडौं, नेपाल" 
                                value={formData.placeOfBirth}
                                onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>राशी (Zodiac Sign)</Label>
                            <Select 
                                value={formData.zodiacSign} 
                                onValueChange={(v) => setFormData({...formData, zodiacSign: v})}
                            >
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="आफ्नो राशी छान्नुहोस्" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zodiacSigns.map(sign => (
                                        <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={handleSaveProfile} 
                            disabled={isSaving}
                            className="w-full sm:w-auto"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "प्रोफाइल सेभ गर्नुहोस्"}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate('/horoscope')}>
                        <CardHeader>
                            <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                दैनिक राशिफल
                            </CardTitle>
                            <CardDescription>वर्तमान गोचरको आधारमा आफ्नो व्यक्तिगत दैनिक राशिफल पढ्नुहोस्।</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate('/chat')}>
                        <CardHeader>
                            <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                एआई ज्योतिषी (The Oracle)
                            </CardTitle>
                            <CardDescription>आफ्नो एआई ज्योतिषीसँग वास्तविक समयमा कुराकानी गर्नुहोस्।</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}

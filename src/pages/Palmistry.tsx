import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Hand, UploadCloud, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PalmistryPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [reading, setReading] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const analyzePalm = async () => {
        if (!imagePreview) return;
        setLoading(true);
        setReading(null);

        try {
            const response = await fetch('/api/gemini/palm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: imagePreview }),
            });
            const data = await response.json();
            if (data.text) {
                setReading(data.text);
            } else {
                setReading("रेखाहरू स्पष्ट रूपमा पढ्न असमर्थ। तस्बिरमा राम्रो उज्यालो छ र हात पूर्ण रूपमा देखिने छ भनी सुनिश्चित गर्नुहोस्।");
            }
        } catch (error) {
            console.error("Palm reading error:", error);
            setReading("केही प्राविधिक समस्या आयो। कृपया फेरि प्रयास गर्नुहोस।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            <header className="text-center space-y-4">
               <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Hand className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold">एआई हस्तरेखा</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    आफ्नो जीवन, हृदय, र मस्तिष्क रेखाहरूको बारेमा अन्तर्दृष्टि प्रकट गर्न आफ्नो प्रमुख हातको स्पष्ट फोटो अपलोड गर्नुहोस्।
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/40 border-primary/20">
                    <CardHeader>
                        <CardTitle>हातको फोटो अपलोड गर्नुहोस्</CardTitle>
                        <CardDescription>स्पष्ट उज्यालो भएको, रेखाहरूमा फोकस गर्नुहोस्।</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col items-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Palm" className="w-full max-w-[300px] h-auto rounded-lg shadow-lg border border-primary/30" />
                        ) : (
                            <div className="w-full aspect-square max-w-[300px] rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center bg-background/50 text-muted-foreground p-6 text-center shadow-inner">
                                <UploadCloud className="h-10 w-10 mb-4 opacity-70" />
                                <p className="text-sm">फोटो छान्नुहोस् वा यहाँ तान्नुहोस्</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            id="palm-upload" 
                        />
                        <div className="flex gap-4 w-full pt-4">
                            <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => document.getElementById('palm-upload')?.click()}
                            >
                                {imagePreview ? 'फोटो परिवर्तन गर्नुहोस्' : 'फोटो छान्नुहोस्'}
                            </Button>
                            <Button 
                                className="flex-1 bg-primary text-primary-foreground" 
                                onClick={analyzePalm} 
                                disabled={!imagePreview || loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                विश्लेषण गर्नुहोस्
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-primary/20 h-full">
                    <CardHeader>
                        <CardTitle>हस्तरेखा फल</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-5rem)] relative">
                        {loading ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-background/50 rounded-b-xl backdrop-blur-sm z-10 space-y-4 text-primary">
                                <Hand className="h-12 w-12 animate-pulse opacity-80" />
                                <span className="font-display tracking-widest text-sm uppercase">भाग्यको खोजी गर्दै...</span>
                             </div>
                        ) : reading ? (
                            <div className="markdown-body text-sm prose prose-invert max-w-none h-full overflow-y-auto pr-2 custom-scrollbar">
                                <ReactMarkdown>{reading}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-center p-6 opacity-60 bg-muted/20 border border-dashed rounded-lg border-muted">
                                <p>तपाईंको हस्तरेखा फल यहाँ देखिनेछ।</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

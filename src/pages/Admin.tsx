import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Users, Crown, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function AdminDashboard() {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, premium: 0 });
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (!loading && profile?.role !== 'admin') {
            navigate('/');
        }
    }, [profile, loading, navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            if (profile?.role !== 'admin') return;
            setFetching(true);
            try {
                const usersSnap = await getDocs(collection(db, 'users'));
                let premiumCount = 0;
                usersSnap.forEach(doc => {
                    if (doc.data().subscriptionPlan === 'premium') premiumCount++;
                });
                setStats({ users: usersSnap.size, premium: premiumCount });
            } catch (e) {
                console.error("Error fetching stats", e);
            } finally {
                setFetching(false);
            }
        };
        fetchStats();
    }, [profile]);

    if (loading || fetching) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    if (profile?.role !== 'admin') return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-bold">Admin Sanctum</h1>
                <p className="text-muted-foreground">Manage the cosmic audience and oversight.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Travelers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-accent/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Premium Souls</CardTitle>
                        <Crown className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.premium}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-card-foreground/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Online</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

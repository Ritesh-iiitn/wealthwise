'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AssetLiabilityChartProps {
    data: { name: string; assets: number; liabilities: number }[];
}

export function AssetLiabilityChart({ data = [] }: AssetLiabilityChartProps) {
    if (!data.length) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Asset vs Liability</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Assets vs Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                formatter={(value: any) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="assets" fill="#10b981" radius={[4, 4, 0, 0]} name="Assets" />
                            <Bar dataKey="liabilities" fill="#ef4444" radius={[4, 4, 0, 0]} name="Liabilities" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

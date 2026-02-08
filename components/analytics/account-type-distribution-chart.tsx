'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface AccountTypeDistributionChartProps {
    data: { name: string; value: number; color: string }[];
}

export function AccountTypeDistributionChart({ data = [] }: AccountTypeDistributionChartProps) {
    if (!data.length) {
        return (
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Account Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No account data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Account Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {data.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-muted-foreground">
                                {entry.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

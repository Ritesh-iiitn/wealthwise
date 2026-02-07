"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyTrendChartProps {
    data?: { name: string; total: number }[];
}

export function MonthlyTrendChart({ data = [] }: MonthlyTrendChartProps) {
    if (!data.length) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Monthly Spending Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No trend data available
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 10,
                                left: 10,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888888" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888888" }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

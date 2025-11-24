"use client"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig
} from "@/components/ui/chart"
import { BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, PieChart, Pie, Bar } from "recharts"

const revenueChartData = [
    { month: "Jan", revenue: 18600 },
    { month: "Feb", revenue: 20500 },
    { month: "Mar", revenue: 23700 },
    { month: "Apr", revenue: 17300 },
    { month: "May", revenue: 25900 },
    { month: "Jun", revenue: 28400 },
]

const revenueChartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export function RevenueChart() {
    return (
        <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
            <RechartsBarChart accessibilityLayer data={revenueChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </RechartsBarChart>
        </ChartContainer>
    )
}

interface ServiceChartProps {
    serviceChartData: Array<{ service: string; bookings: number; fill: string }>;
    serviceChartConfig: ChartConfig;
}

export function ServicesChart({ serviceChartData, serviceChartConfig }: ServiceChartProps) {
    return (
        <ChartContainer
            config={serviceChartConfig}
            className="mx-auto aspect-square h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={serviceChartData}
                    dataKey="bookings"
                    nameKey="service"
                    innerRadius={60}
                    strokeWidth={5}
                />
            </PieChart>
        </ChartContainer>
    )
}

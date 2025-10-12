import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Plus, Eye } from "lucide-react";
import Link from "next/link";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import { getBusinessByCode } from "@/queries/server/business/getBusinessByCode";

export default async function BusDashboard({ params }: { params: Promise<{ codeId: string; locale: string }> }) {
  const { codeId, locale } = await params;
  const { data } = await getBusinessByCode(codeId);

  const stats = [
    {
      title: "Total Events",
      value: "12",
      icon: Calendar,
      description: "Events created",
    },
    {
      title: "Total Attendees",
      value: "1,234",
      icon: Users,
      description: "People registered",
    },
    {
      title: "Revenue",
      value: "$5,678",
      icon: TrendingUp,
      description: "This month",
    },
  ];

  const recentEvents = [
    {
      id: "1",
      title: "Tech Conference 2024",
      date: "2024-01-15",
      attendees: 150,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Workshop Series",
      date: "2024-01-20",
      attendees: 75,
      status: "upcoming",
    },
  ];

  return (
    <div className="space-y-6 w-full flex flex-col items-center max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold">{data?.business.name || "Business Dashboard"}</h1>
          <p className="text-muted-foreground">
            {data?.business.description || "Manage your business events and activities"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Your latest events and activities</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <Button size="sm" asChild className="w-full md:w-auto">
                <Link href={`/${locale}/dashboard/bus/${codeId}/new`}>
                  <Plus className="h-4 w-4" />
                  New Event
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
                <Link href={`/${locale}/dashboard/bus/${codeId}/events`}>
                  <Eye className="h-4 w-4" />
                  View All
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} • {event.attendees} attendees
                  </p>
                </div>
                <Badge variant="outline">{event.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href={`/${locale}/dashboard/bus/${codeId}/create-event`}>
                <Plus className="h-6 w-6 mb-2" />
                Create Event
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href={`/${locale}/dashboard/bus/${codeId}/attendees`}>
                <Users className="h-6 w-6 mb-2" />
                Manage Attendees
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href={`/${locale}/dashboard/bus/${codeId}/analytics`}>
                <TrendingUp className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href={`/${locale}/dashboard/bus/${codeId}/settings`}>
                <Calendar className="h-6 w-6 mb-2" />
                Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

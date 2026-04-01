import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useApplicationStore } from "@/store/application.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AppDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { applications, fetchApplications, isLoading } = useApplicationStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const { stats, recentApplications } = useMemo(() => {
    let total = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    applications.forEach((app) => {
      total++;
      if (app.status === "SUBMITTED" || app.status === "REVIEWING" || app.status === "REVISION_REQUESTED") pending++;
      if (app.status === "APPROVED") approved++;
      if (app.status === "REJECTED") rejected++;
    });

    const recent = applications.slice(0, 5).map((app) => ({
      id: app.id || app._id,
      refNumber: app.sectionA?.referenceNumber || "N/A",
      applicant: app.sectionA?.operatorOrProjectPromoter || "Unknown",
      type: app.sectionA?.contractType || "N/A",
      date: app.updatedAt ? format(new Date(app.updatedAt), "MMM d, yyyy") : "N/A",
      status: app.status,
      progress: app.status === "APPROVED" ? 100 : app.status === "REJECTED" ? 0 : app.status === "DRAFT" ? 25 : 75,
    }));

    return {
      stats: [
        {
          id: "applications",
          label: "Total Applications",
          value: total.toString(),
          change: "Total submitted",
          trend: "up",
          icon: FileText,
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
        },
        {
          id: "pending",
          label: "Pending Review",
          value: pending.toString(),
          change: "Currently active",
          trend: "up",
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        },
        {
          id: "approved",
          label: "Approved",
          value: approved.toString(),
          change: "Successfully processed",
          trend: "up",
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-950/20",
        },
        {
          id: "rejected",
          label: "Rejected",
          value: rejected.toString(),
          change: "Needs attention",
          trend: "down",
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-950/20",
        },
      ],
      recentApplications: recent,
    };
  }, [applications]);

  const activityTimeline = [
    {
      id: "1",
      title: "New application received",
      description:
        "Chevron Nigeria Limited submitted a new application for drilling equipment",
      time: "2 hours ago",
      type: "info",
      icon: FileText,
    },
    {
      id: "2",
      title: "Application approved",
      description: "APP-2023-001 has been approved by the review committee",
      time: "5 hours ago",
      type: "success",
      icon: CheckCircle2,
    },
    {
      id: "3",
      title: "Application rejected",
      description:
        "APP-2023-004 has been rejected due to insufficient documentation",
      time: "1 day ago",
      type: "error",
      icon: AlertCircle,
    },
    {
      id: "4",
      title: "Application status updated",
      description: "APP-2023-002 is now in final review stage",
      time: "2 days ago",
      type: "warning",
      icon: Clock,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "SUBMITTED":
      case "REVIEWING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "REVISION_REQUESTED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your applications today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={() => navigate("/app/new-application")}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card
              key={stat.id}
              className="bg-green-600 hover:bg-green-700 transition-colors border-none shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-green-100/90 text-sm font-semibold uppercase tracking-wide mb-1">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl md:text-5xl font-bold text-yellow-300">{stat.value}</div>
                <div
                  className={`flex items-center text-xs mt-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendIcon className="h-3 w-3 mr-1" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Latest applications submitted to the NCDMB portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ) : recentApplications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No recent applications found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentApplications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">
                              {app.refNumber}
                            </TableCell>
                            <TableCell className="max-w-50 truncate">
                              {app.applicant}
                            </TableCell>
                            <TableCell>{app.type}</TableCell>
                            <TableCell>{app.date}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(app.status || "")}>
                                {app.status || "UNKNOWN"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="w-full max-w-25">
                                <Progress value={app.progress} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => navigate("/app/applications")}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={() => navigate("/app/applications")}>
                  View All Applications
                </Button>
              </CardFooter>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent system activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityTimeline.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "info"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "success"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "error"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                View and manage all applications
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Applications management functionality coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics and reports</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Complete system activity history
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Detailed activity log coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppDashboard;

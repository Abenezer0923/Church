import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTithes: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    monthlyMembers: 0,
    yearlyMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTithes, setRecentTithes] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [memberTithingData, setMemberTithingData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === "admin" || user?.role === "super_admin") {
        // Fetch members count
        const membersResponse = await axios.get("/api/members?limit=1");

        // Fetch payment statistics
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [paymentsResponse, statsResponse] = await Promise.all([
          axios.get("/api/payments?limit=5"),
          axios.get(`/api/payments/stats/summary?year=${currentYear}`),
        ]);

        const monthlyStats = statsResponse.data.summary;
        const currentMonthData = statsResponse.data.monthly.find(
          (m) => m.payment_month === currentMonth
        );

        // Calculate total tithes for current month and year
        console.log('Stats Response:', statsResponse.data); // Add this for debugging
        const summary = statsResponse.data.summary || {};
        
        // Convert null values to 0 and ensure numbers
        const monthlyTithe = Number(summary.current_month_tithe) || 0;
        const yearlyTithe = Number(summary.yearly_tithe) || 0;
        const monthlyMembers = Number(summary.current_month_members) || 0;
        const yearlyMembers = Number(summary.paying_members) || 0;

        setStats({
          totalMembers: membersResponse.data.pagination.total,
          totalTithes: yearlyMembers,
          monthlyRevenue: monthlyTithe,
          yearlyRevenue: yearlyTithe,
          monthlyMembers: monthlyMembers,
          yearlyMembers: yearlyMembers,
        });

        setRecentTithes(paymentsResponse.data.payments || []);
        setMonthlyData(statsResponse.data.monthly || []);

        // Process member tithing data for charts (using only tithe_amount)
        const memberTithes =
          paymentsResponse.data.payments?.reduce((acc, payment) => {
            const memberName = `${payment.first_name} ${payment.last_name}`;
            acc[memberName] = (acc[memberName] || 0) + payment.tithe_amount;
            return acc;
          }, {}) || {};

        setMemberTithingData(Object.entries(memberTithes).slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const StatCard = ({ title, value, icon: Icon, color, loading }) => (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-lg font-medium text-gray-900">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
              ) : (
                value
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  if (user?.role === "user") {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Welcome to AFGC Management
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You are logged in as a member. Contact an administrator for more
            access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.first_name}! Here's what's happening at Akaki
          Full Gospel Church.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="text-blue-600"
          loading={loading}
        />
        <StatCard
          title="Total Tithes Count"
          value={stats.totalTithes}
          icon={CreditCard}
          color="text-green-600"
          loading={loading}
        />
        <StatCard
          title={`Monthly Tithes (${new Date().toLocaleString('default', { month: 'long' })})`}
          value={
            <div>
              <div className="text-xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
              <div className="text-sm text-gray-600 mt-1">
                {`${stats.monthlyMembers} members contributed`}
              </div>
            </div>
          }
          icon={DollarSign}
          color="text-yellow-600"
          loading={loading}
        />
        <StatCard
          title={`Total Tithes (${new Date().getFullYear()})`}
          value={
            <div>
              <div className="text-xl font-bold">{formatCurrency(stats.yearlyRevenue)}</div>
              <div className="text-sm text-gray-600 mt-1">
                {`${stats.yearlyMembers} members contributed`}
              </div>
            </div>
          }
          icon={TrendingUp}
          color="text-purple-600"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Tithing Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Monthly Tithing Trends
            </h3>
          </div>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
          ) : (
            <div className="h-64">
              <Bar
                data={{
                  labels: monthlyData.map((d) => `Month ${d.payment_month}`),
                  datasets: [
                    {
                      label: "Monthly Tithes (ETB)",
                      data: monthlyData.map((d) => d.total_amount || 0),
                      backgroundColor: "rgba(59, 130, 246, 0.5)",
                      borderColor: "rgba(59, 130, 246, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Top Contributors Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-600" />
              Top Contributors
            </h3>
          </div>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
          ) : (
            <div className="h-64">
              <Pie
                data={{
                  labels: memberTithingData.map(([name]) => name),
                  datasets: [
                    {
                      data: memberTithingData.map(([, amount]) => amount),
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 205, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(153, 102, 255, 0.5)",
                        "rgba(255, 159, 64, 0.5)",
                        "rgba(199, 199, 199, 0.5)",
                        "rgba(83, 102, 255, 0.5)",
                        "rgba(255, 99, 255, 0.5)",
                        "rgba(99, 255, 132, 0.5)",
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 205, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                        "rgba(199, 199, 199, 1)",
                        "rgba(83, 102, 255, 1)",
                        "rgba(255, 99, 255, 1)",
                        "rgba(99, 255, 132, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recent Tithes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Tithes</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentTithes.length > 0 ? (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentTithes.map((tithe) => (
                <li key={tithe.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {tithe.first_name} {tithe.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tithe.payment_date).toLocaleDateString()} •{" "}
                        {tithe.payment_method}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(tithe.total_amount)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-6">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No tithes yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by recording a tithe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

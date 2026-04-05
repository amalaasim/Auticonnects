import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Brain,
  Clock3,
  Eye,
  Star,
  Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  aggregateDailySessionTime,
  aggregateWeeklyEmotions,
  buildFocusPatternRows,
  buildModuleProgressRows,
} from "@/lib/analytics/reporting";
import type { AnalyticsSessionRecord } from "@/lib/analytics/types";
import homeButton from "../assests/homebutton.png";
import signoutNew from "../assests/signout-new.png";
import settingsIcon from "../assests/settings.png";
import TopBarLogoutIcon from "../components/TopBarLogoutIcon";
import TopBarVolumeIcon from "../components/TopBarVolumeIcon";
import AppGreetingHeader from "../components/AppGreetingHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

type EmotionMetricRow = {
  session_id: string;
  emotion: string;
  sample_count: number;
};

type FocusMetricRow = {
  session_id: string;
  focus_time_ms: number;
  distracted_time_ms: number;
  distraction_count: number;
  focus_ratio: number;
};

const MODULE_TOTAL = 5;

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function prettifyLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getModulePercent(row: { moduleKey: string; bestScore: number | null; completed: boolean }) {
  if (!row.completed) return 0;
  if (row.bestScore == null) return 100;

  if (["cookie", "car", "shoe", "ball"].includes(row.moduleKey)) {
    return Math.max(0, Math.min(100, (row.bestScore / 3) * 100));
  }

  return Math.max(0, Math.min(100, row.bestScore));
}

function buildCloud(left: string, top: string, size: number, opacity = 0.18) {
  return {
    position: "absolute",
    left,
    top,
    width: size,
    height: size * 0.58,
    borderRadius: "999px",
    background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${opacity}) 0%, rgba(255,255,255,0) 72%)`,
    filter: "blur(4px)",
    pointerEvents: "none",
  };
}

function StatCard({
  icon,
  title,
  value,
  accent,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  accent: string;
  note: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "18px",
        px: { xs: 1.75, md: 2 },
        py: { xs: 1.5, md: 1.75 },
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.16) 100%)",
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "0 16px 40px rgba(11, 31, 42, 0.18)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          color: "#fff",
          background: accent,
          boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            color: "#ffffff",
            fontSize: { xs: 12, md: 13 },
            lineHeight: 1.2,
            opacity: 0.8,
            fontFamily: "Petrona, serif",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#fff",
            fontSize: { xs: 20, md: 24 },
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "#79ffb5",
          fontSize: { xs: 11, md: 12 },
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {note}
      </Typography>
    </Paper>
  );
}

function ChartCard({
  icon,
  iconBg,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, md: 1.75 },
        borderRadius: "20px",
        minHeight: 300,
        background: "linear-gradient(180deg, rgba(247,250,255,0.95) 0%, rgba(240,247,255,0.9) 100%)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 24px 50px rgba(17, 51, 67, 0.18)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, mb: 1.25 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "11px",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: iconBg,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ color: "#223249", fontSize: 15, fontWeight: 700, lineHeight: 1.15 }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#617189", fontSize: 11.5, lineHeight: 1.15 }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 210 }}>{children}</Box>
    </Paper>
  );
}

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AnalyticsSessionRecord[]>([]);
  const [emotionRows, setEmotionRows] = useState<EmotionMetricRow[]>([]);
  const [focusRows, setFocusRows] = useState<FocusMetricRow[]>([]);
  const topBarIcons = [
    { volumeToggle: true, alt: "Volume" },
    { src: homeButton, alt: "Home", onClick: () => navigate("/english") },
    { src: settingsIcon, alt: "Settings", onClick: () => navigate("/settings") },
    { src: signoutNew, logoutMenu: true },
  ];

  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const [sessionResult, emotionResult, focusResult] = await Promise.all([
        supabase
          .from("game_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("started_at", { ascending: false }),
        supabase
          .from("session_emotion_metrics")
          .select("session_id, emotion, sample_count")
          .eq("user_id", user.id),
        supabase
          .from("session_focus_metrics")
          .select("session_id, focus_time_ms, distracted_time_ms, distraction_count, focus_ratio")
          .eq("user_id", user.id),
      ]);

      if (ignore) return;

      const firstError =
        sessionResult.error || emotionResult.error || focusResult.error;

      if (firstError) {
        setError(firstError.message);
        setLoading(false);
        return;
      }

      setSessions((sessionResult.data || []) as AnalyticsSessionRecord[]);
      setEmotionRows((emotionResult.data || []) as EmotionMetricRow[]);
      setFocusRows((focusResult.data || []) as FocusMetricRow[]);
      setLoading(false);
    };

    load();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const dailyTime = useMemo(() => aggregateDailySessionTime(sessions), [sessions]);
  const weeklyEmotions = useMemo(
    () => aggregateWeeklyEmotions(emotionRows, sessions),
    [emotionRows, sessions]
  );
  const focusPatterns = useMemo(
    () => buildFocusPatternRows(sessions, focusRows).slice(0, 6).reverse(),
    [sessions, focusRows]
  );
  const moduleProgress = useMemo(() => buildModuleProgressRows(sessions), [sessions]);
  const sortedModuleProgress = useMemo(
    () =>
      [...moduleProgress].sort((left, right) => {
        const percentDiff = getModulePercent(right) - getModulePercent(left);
        if (percentDiff !== 0) return percentDiff;
        return left.moduleKey.localeCompare(right.moduleKey);
      }),
    [moduleProgress]
  );

  const totalSessionSeconds = useMemo(
    () => sessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0),
    [sessions]
  );

  const completedModules = useMemo(
    () => moduleProgress.filter((row) => row.completed).length,
    [moduleProgress]
  );

  const totalRewards = useMemo(
    () => sessions.reduce((sum, session) => sum + (session.star_count || 0), 0),
    [sessions]
  );
  const rewardedSessions = useMemo(
    () => sessions.filter((session) => (session.star_count || 0) > 0).length,
    [sessions]
  );

  const overallProgress = useMemo(() => {
    if (!moduleProgress.length) return 0;
    const total = moduleProgress.reduce((sum, row) => sum + getModulePercent(row), 0);
    return total / MODULE_TOTAL;
  }, [moduleProgress]);

  const dailySessionChartData = useMemo(
    () => ({
      labels: dailyTime.map((entry) =>
        new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
          weekday: "short",
        })
      ),
      datasets: [
        {
          label: "Minutes",
          data: dailyTime.map((entry) => Number((entry.durationSeconds / 60).toFixed(1))),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.22)",
          pointBackgroundColor: "#3b82f6",
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.42,
          borderWidth: 3,
        },
      ],
    }),
    [dailyTime]
  );

  const emotionChartData = useMemo(
    () => ({
      labels: weeklyEmotions.map((row) => prettifyLabel(row.emotion)),
      datasets: [
        {
          label: "Emotion %",
          data: weeklyEmotions.map((row) => row.percentage),
          backgroundColor: "rgba(138, 92, 246, 0.92)",
          borderRadius: 10,
        },
      ],
    }),
    [weeklyEmotions]
  );

  const focusChartData = useMemo(
    () => ({
      labels: focusPatterns.map((_, index) => `Session ${index + 1}`),
      datasets: [
        {
          label: "Focus %",
          data: focusPatterns.map((row) => Math.round((row.focus?.focus_ratio || 0) * 100)),
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.14)",
          pointBackgroundColor: "#f59e0b",
          pointBorderColor: "#f59e0b",
          pointRadius: 4,
          pointHoverRadius: 5,
          fill: false,
          tension: 0.35,
          borderWidth: 3,
        },
      ],
    }),
    [focusPatterns]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#66748a", font: { size: 12 } },
        grid: { color: "rgba(155, 179, 208, 0.18)", drawBorder: false },
      },
      y: {
        ticks: { color: "#66748a", font: { size: 12 } },
        grid: { color: "rgba(155, 179, 208, 0.18)", drawBorder: false },
        beginAtZero: true,
      },
    },
  } as const;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(180deg, #08151b 0%, #6dc5f4 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#ffffff" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #05080b 0%, #0e1c24 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflowX: "hidden",
          overflowY: "visible",
          width: "100%",
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, rgba(22,36,44,0.98) 0%, rgba(79,131,157,0.94) 56%, rgba(126,205,242,0.96) 100%)",
        }}
      >
        <Box sx={buildCloud("-4%", "52%", 240, 0.3)} />
        <Box sx={buildCloud("82%", "6%", 210, 0.13)} />
        <Box sx={buildCloud("88%", "16%", 180, 0.16)} />
        <Box sx={buildCloud("64%", "73%", 220, 0.16)} />
        <Box sx={buildCloud("27%", "73%", 180, 0.12)} />

        <Paper
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: "5%",
            paddingRight: "5%",
            mb: 2,
            borderRadius: 0,
            border: "none",
            background: "linear-gradient(10deg, rgba(5, 8, 7, 0.6) 0%, rgba(11,61,46,0.4) 100%)",
            boxShadow: "none",
          }}
          elevation={0}
        >
          <Box
            component={AppGreetingHeader}
            sx={{
              width: { lg: "17%", md: "25%", sm: "29%", xs: "27%" },
              marginTop: { lg: "1.5%", md: "2%", sm: "3%", xs: "43%" },
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
            {topBarIcons.map((item, index) => (
              item.volumeToggle ? (
                <TopBarVolumeIcon
                  key={index}
                  alt={item.alt}
                  sx={{
                    width: { lg: "45.23px", md: "25%", sm: "29%", xs: "40px" },
                    height: "45.23px",
                    objectFit: "contain",
                    marginTop: { lg: "16px", md: "19px", sm: "3%", xs: "194px" },
                    opacity: 1,
                    filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                  }}
                />
              ) : item.logoutMenu ? (
                <TopBarLogoutIcon
                  key={index}
                  src={item.src}
                  sx={{
                    width: { lg: "45.23px", md: "25%", sm: "29%", xs: "40px" },
                    height: "45.23px",
                    objectFit: "contain",
                    marginTop: { lg: "16px", md: "19px", sm: "3%", xs: "194px" },
                    opacity: 1,
                    filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                  }}
                />
              ) : (
                <Box
                  key={index}
                  component="img"
                  onClick={item.onClick}
                  sx={{
                    width: { lg: "45.23px", md: "25%", sm: "29%", xs: "40px" },
                    height: "45.23px",
                    objectFit: "contain",
                    marginTop: { lg: "16px", md: "19px", sm: "3%", xs: "194px" },
                    opacity: 1,
                    filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                    cursor: item.onClick ? "pointer" : "default",
                  }}
                  src={item.src}
                  alt=""
                />
              )
            ))}
          </Box>
        </Paper>

        <Box
          sx={{
            px: { xs: 2, md: 4.5 },
            pb: { xs: 1.5, md: 2 },
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, position: "relative", zIndex: 1 }}>
              {error}
            </Alert>
          )}

          {!sessions.length ? (
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                zIndex: 1,
                p: 4,
                borderRadius: "28px",
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                backdropFilter: "blur(16px)",
              }}
            >
              No report data yet. Complete a few game sessions and this dashboard will populate.
            </Paper>
          ) : (
            <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, minmax(0, 1fr))" },
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <StatCard
                icon={<Clock3 size={20} />}
                title="Total Session Time"
                value={formatDuration(totalSessionSeconds)}
                note={`+${sessions.length} sessions`}
                accent="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              />
              <StatCard
                icon={<Trophy size={20} />}
                title="Modules Completed"
                value={`${completedModules}/${MODULE_TOTAL}`}
                note={`+${completedModules} done`}
                accent="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              />
              <StatCard
                icon={<Star size={20} />}
                title="Rewards"
                value={String(totalRewards)}
                note={`${rewardedSessions} star sessions`}
                accent="linear-gradient(135deg, #f59e0b 0%, #ff7a00 100%)"
              />
              <StatCard
                icon={<Brain size={20} />}
                title="Overall Progress"
                value={formatPercent(overallProgress)}
                note={`${sortedModuleProgress.length} modules`}
                accent="linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 1.5,
              }}
            >
              <ChartCard
                icon={<Clock3 size={18} />}
                iconBg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                title="Daily Session Time"
                subtitle="Minutes spent in learning sessions"
              >
                <Line data={dailySessionChartData} options={chartOptions} />
              </ChartCard>

              <ChartCard
                icon={<Brain size={18} />}
                iconBg="linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
                title="Emotions This Week"
                subtitle="Distribution by emotion type"
              >
                <Bar
                  data={emotionChartData}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        max: 100,
                      },
                    },
                  }}
                />
              </ChartCard>

              <ChartCard
                icon={<Eye size={18} />}
                iconBg="linear-gradient(135deg, #ff8a00 0%, #ff6200 100%)"
                title="Eye Gaze & Focus"
                subtitle="Focus ratio across recent sessions"
              >
                <Line
                  data={focusChartData}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        max: 100,
                      },
                    },
                  }}
                />
              </ChartCard>

              <ChartCard
                icon={<Trophy size={18} />}
                iconBg="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                title="Module Progress"
                subtitle="Completion status by module"
              >
                <Box sx={{ display: "grid", gap: 1.1 }}>
                  {sortedModuleProgress.map((row) => {
                    const percent = getModulePercent(row);

                    return (
                      <Box key={row.moduleKey}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.45,
                            gap: 1.5,
                          }}
                        >
                          <Typography sx={{ color: "#2a3850", fontSize: 13, fontWeight: 600 }}>
                            {prettifyLabel(row.moduleKey)}
                          </Typography>
                          <Typography sx={{ color: "#5c6b81", fontSize: 12 }}>
                            {formatPercent(percent)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            borderRadius: "999px",
                            background: "rgba(161, 175, 191, 0.28)",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${percent}%`,
                              height: "100%",
                              borderRadius: "999px",
                              background: "linear-gradient(90deg, #19d66f 0%, #0da44c 100%)",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </ChartCard>
            </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

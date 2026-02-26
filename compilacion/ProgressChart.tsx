import { useMemo } from 'react';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Clock, Award, BookOpen } from 'lucide-react';

interface ProgressChartProps {
  progressPercent: number;
  modulesCompleted: number;
  totalModules: number;
  totalTimeMinutes: number;
  averageScore: number;
  weeklyProgress?: { day: string; completed: number }[];
}

const ProgressChart = ({
  progressPercent,
  modulesCompleted,
  totalModules,
  totalTimeMinutes,
  averageScore,
  weeklyProgress = []
}: ProgressChartProps) => {
  const radialData = useMemo(() => [
    {
      name: 'Progreso',
      value: progressPercent,
      fill: 'hsl(var(--silver-primary))'
    }
  ], [progressPercent]);

  const pieData = useMemo(() => [
    { name: 'Completados', value: modulesCompleted, fill: 'hsl(var(--silver-primary))' },
    { name: 'Pendientes', value: totalModules - modulesCompleted, fill: 'hsl(var(--muted))' }
  ], [modulesCompleted, totalModules]);

  const defaultWeeklyData = [
    { day: 'Lun', completed: 0 },
    { day: 'Mar', completed: 1 },
    { day: 'Mié', completed: 0 },
    { day: 'Jue', completed: 2 },
    { day: 'Vie', completed: 1 },
    { day: 'Sáb', completed: 0 },
    { day: 'Dom', completed: 0 }
  ];

  const chartData = weeklyProgress.length > 0 ? weeklyProgress : defaultWeeklyData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Progress Circle */}
      <div className="card-elite p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-silver-primary" />
          Progreso General
        </h3>
        
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={12} 
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold text-gradient-silver">
                {progressPercent}%
              </span>
              <span className="text-sm text-muted-foreground">Completado</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <BookOpen className="w-5 h-5 text-silver-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{modulesCompleted}/{totalModules}</p>
            <p className="text-xs text-muted-foreground">Módulos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Clock className="w-5 h-5 text-silver-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{Math.round(totalTimeMinutes / 60)}h</p>
            <p className="text-xs text-muted-foreground">Tiempo</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Award className="w-5 h-5 text-silver-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{averageScore}%</p>
            <p className="text-xs text-muted-foreground">Promedio</p>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card-elite p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-silver-primary" />
          Actividad Semanal
        </h3>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--silver-primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--silver-primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--silver-primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Module distribution */}
        <div className="flex items-center justify-between mt-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distribución</p>
              <p className="font-semibold text-foreground">
                {modulesCompleted} de {totalModules} módulos
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gradient-silver">
              {totalModules - modulesCompleted}
            </p>
            <p className="text-xs text-muted-foreground">pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;

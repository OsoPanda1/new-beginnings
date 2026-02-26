/**
 * 🎯 System Orchestrator - TAMV MD-X4™
 * Central coordination hub for all platform modules
 */

export type ModuleStatus = 'initializing' | 'active' | 'degraded' | 'offline';
export type SystemEvent = 'module_ready' | 'module_error' | 'user_interaction' | 'emotion_update' | 'sensor_data' | 'security_alert';

export interface ModuleHealth {
  name: string;
  status: ModuleStatus;
  lastCheck: Date;
  performance: number;
  errors: number;
}

export interface UserInteraction {
  userId?: string;
  sessionId: string;
  action: string;
  context: Record<string, unknown>;
  emotionalState?: Record<string, number>;
  sensorData?: Record<string, unknown>;
}

export interface SystemResponse {
  success: boolean;
  data?: unknown;
  emotionalContext?: string;
  recommendations?: string[];
  adaptedUI?: Record<string, unknown>;
}

type EventCallback = (data: unknown) => void;

class SystemOrchestrator {
  private modules: Map<string, ModuleHealth>;
  private isInitialized: boolean = false;
  private healthCheckInterval?: ReturnType<typeof setInterval>;
  private eventListeners: Map<string, EventCallback[]> = new Map();

  constructor() {
    this.modules = new Map();
  }

  on(event: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  private emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(cb => cb(data));
  }

  removeAllListeners(): void {
    this.eventListeners.clear();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 TAMV MD-X4™ System Orchestrator initializing...');

    this.registerModule('QuantumAPI');
    this.registerModule('EmotionBI');
    this.registerModule('SensorHub');
    this.registerModule('AutoDoc');
    this.registerModule('IsabellaAI');
    this.registerModule('AnubisSentinel');

    this.startHealthMonitoring();

    this.isInitialized = true;
    this.emit('system_ready');
    console.log('✅ System Orchestrator ready');
  }

  private registerModule(name: string): void {
    this.modules.set(name, {
      name,
      status: 'initializing',
      lastCheck: new Date(),
      performance: 100,
      errors: 0
    });
  }

  updateModuleStatus(name: string, status: ModuleStatus, performance?: number): void {
    const module = this.modules.get(name);
    if (module) {
      module.status = status;
      module.lastCheck = new Date();
      if (performance !== undefined) {
        module.performance = performance;
      }
      this.emit('module_update', module);
    }
  }

  async processUserInteraction(interaction: UserInteraction): Promise<SystemResponse> {
    try {
      const { emotionalState, sensorData } = interaction;

      this.emit('user_interaction', interaction);

      const response: SystemResponse = {
        success: true,
        data: { processed: true },
        recommendations: []
      };

      if (emotionalState) {
        const dominantEmotion = this.getDominantEmotion(emotionalState);
        response.emotionalContext = dominantEmotion;
        response.adaptedUI = this.adaptUIForEmotion(dominantEmotion);
      }

      if (sensorData) {
        this.emit('sensor_data', sensorData);
        response.recommendations = this.generateSensorRecommendations(sensorData);
      }

      return response;
    } catch (error) {
      console.error('Error processing user interaction:', error);
      return {
        success: false,
        data: { error: 'Processing failed' }
      };
    }
  }

  private getDominantEmotion(emotionalState: Record<string, number>): string {
    let maxEmotion = 'neutral';
    let maxValue = 0;

    for (const [emotion, value] of Object.entries(emotionalState)) {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    }

    return maxEmotion;
  }

  private adaptUIForEmotion(emotion: string): Record<string, unknown> {
    const adaptations: Record<string, Record<string, string>> = {
      joy: { theme: 'vibrant', animations: 'enhanced', colors: 'warm' },
      calm: { theme: 'serene', animations: 'gentle', colors: 'cool' },
      excited: { theme: 'energetic', animations: 'dynamic', colors: 'bright' },
      focused: { theme: 'minimal', animations: 'subtle', colors: 'neutral' },
      neutral: { theme: 'balanced', animations: 'moderate', colors: 'standard' }
    };

    return adaptations[emotion] || adaptations.neutral;
  }

  private generateSensorRecommendations(sensorData: Record<string, unknown>): string[] {
    const recommendations: string[] = [];
    const heartRate = sensorData.heartRate as number | undefined;
    const eyeStrain = sensorData.eyeStrain as number | undefined;
    const posture = sensorData.posture as number | undefined;

    if (heartRate && heartRate > 100) {
      recommendations.push('Consider taking a break - elevated heart rate detected');
    }

    if (eyeStrain && eyeStrain > 0.7) {
      recommendations.push('Reduce screen brightness or take an eye break');
    }

    if (posture !== undefined && posture < 0.5) {
      recommendations.push('Adjust your posture for better comfort');
    }

    return recommendations;
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  private performHealthCheck(): void {
    for (const [name, module] of this.modules) {
      if (module.errors > 5) {
        this.updateModuleStatus(name, 'degraded', module.performance * 0.8);
      } else if (module.status === 'initializing') {
        this.updateModuleStatus(name, 'active', 100);
      }
    }

    this.emit('health_check_complete', this.getSystemHealth());
  }

  getSystemHealth(): {
    overall: 'healthy' | 'degraded' | 'critical';
    modules: ModuleHealth[];
    uptime: number;
  } {
    const modules = Array.from(this.modules.values());
    const activeModules = modules.filter(m => m.status === 'active').length;
    const totalModules = modules.length;
    
    let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (activeModules < totalModules * 0.5) {
      overall = 'critical';
    } else if (activeModules < totalModules * 0.8) {
      overall = 'degraded';
    }

    return {
      overall,
      modules,
      uptime: 0
    };
  }

  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.removeAllListeners();
    this.isInitialized = false;
    console.log('🛑 System Orchestrator shutdown complete');
  }
}

export const systemOrchestrator = new SystemOrchestrator();

if (typeof window !== 'undefined') {
  systemOrchestrator.initialize().catch(console.error);
}

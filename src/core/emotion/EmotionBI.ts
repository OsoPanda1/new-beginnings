/**
 * 💓 Emotion BI - TAMV MD-X4™
 * Quantum-enhanced emotional analytics and behavioral intelligence
 */

export type EmotionType = 'joy' | 'calm' | 'excited' | 'focused' | 'sad' | 'anxious' | 'neutral';

export interface EmotionalState {
  primary: EmotionType;
  intensity: number; // 0-1
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0-1 (low to high energy)
  timestamp: Date;
}

export interface BiometricData {
  heartRate?: number;
  hrv?: number; // Heart Rate Variability
  gsr?: number; // Galvanic Skin Response
  respirationRate?: number;
  skinTemperature?: number;
}

export interface EmotionalAnalysis {
  currentState: EmotionalState;
  predictedState?: EmotionalState | undefined;
  confidence: number;
  recommendations: string[];
  insights: string[];
}

export interface EmotionHeatmap {
  userId: string;
  timestamp: Date;
  emotions: Record<EmotionType, number>;
  location?: { x: number; y: number; z?: number };
  context?: string;
}

class EmotionBI {
  private emotionHistory: Map<string, EmotionalState[]> = new Map();

  /**
   * Analyze emotional state from biometric data
   */
  async analyzeFromBiometrics(biometrics: BiometricData, userId?: string): Promise<EmotionalAnalysis> {
    const emotionalState = this.inferEmotionFromBiometrics(biometrics);
    
    // Store in history
    if (userId) {
      this.addToHistory(userId, emotionalState);
    }

    // Generate predictions
    const predictedState = userId ? this.predictNextState(userId) : undefined;

    // Generate insights and recommendations
    const analysis: EmotionalAnalysis = {
      currentState: emotionalState,
      predictedState,
      confidence: this.calculateConfidence(biometrics),
      recommendations: this.generateRecommendations(emotionalState, biometrics),
      insights: this.generateInsights(emotionalState)
    };

    return analysis;
  }

  /**
   * Infer emotion from biometric signals
   */
  private inferEmotionFromBiometrics(biometrics: BiometricData): EmotionalState {
    const { heartRate = 70, hrv = 50, gsr = 0.5 } = biometrics;

    // Emotional inference algorithm
    let valence = 0; // -1 to 1
    let arousal = 0; // 0 to 1
    let primary: EmotionType = 'neutral';

    // Heart rate analysis
    if (heartRate > 100) {
      arousal += 0.4;
      if (hrv < 30) arousal += 0.2; // Low HRV = high stress
    } else if (heartRate < 60) {
      arousal -= 0.2;
      valence += 0.2; // Low HR often correlates with calm
    }

    // GSR analysis (stress/excitement indicator)
    if (gsr > 0.7) {
      arousal += 0.3;
      valence -= 0.2; // High GSR often indicates stress
    } else if (gsr < 0.3) {
      valence += 0.3;
      arousal -= 0.1;
    }

    // HRV analysis (autonomic balance)
    if (hrv > 60) {
      valence += 0.3;
      primary = 'calm';
    } else if (hrv < 30) {
      valence -= 0.3;
      primary = 'anxious';
    }

    // Classify emotion based on valence-arousal model
    if (arousal > 0.6) {
      primary = valence > 0 ? 'excited' : 'anxious';
    } else if (arousal > 0.3) {
      primary = valence > 0 ? 'joy' : 'sad';
    } else {
      primary = valence > 0.2 ? 'calm' : valence < -0.2 ? 'sad' : 'neutral';
    }

    const intensity = Math.abs(valence) + arousal;

    return {
      primary,
      intensity: Math.min(intensity, 1),
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal)),
      timestamp: new Date()
    };
  }

  /**
   * Predict next emotional state using temporal patterns
   */
  private predictNextState(userId: string): EmotionalState | undefined {
    const history = this.emotionHistory.get(userId);
    if (!history || history.length < 3) return undefined;

    // Simple trend-based prediction
    const recent = history.slice(-5);
    const avgValence = recent.reduce((sum, s) => sum + s.valence, 0) / recent.length;
    const avgArousal = recent.reduce((sum, s) => sum + s.arousal, 0) / recent.length;

    // Detect trend
    const valenceTrend = recent.length > 1 ? 
      (recent[recent.length - 1].valence - recent[0].valence) / recent.length : 0;
    const arousalTrend = recent.length > 1 ?
      (recent[recent.length - 1].arousal - recent[0].arousal) / recent.length : 0;

    // Predict next state
    const predictedValence = Math.max(-1, Math.min(1, avgValence + valenceTrend));
    const predictedArousal = Math.max(0, Math.min(1, avgArousal + arousalTrend));

    let primary: EmotionType = 'neutral';
    if (predictedArousal > 0.6) {
      primary = predictedValence > 0 ? 'excited' : 'anxious';
    } else if (predictedArousal > 0.3) {
      primary = predictedValence > 0 ? 'joy' : 'sad';
    } else {
      primary = predictedValence > 0.2 ? 'calm' : predictedValence < -0.2 ? 'sad' : 'focused';
    }

    return {
      primary,
      intensity: Math.abs(predictedValence) + predictedArousal,
      valence: predictedValence,
      arousal: predictedArousal,
      timestamp: new Date(Date.now() + 60000) // 1 minute ahead
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(state: EmotionalState, biometrics: BiometricData): string[] {
    const recommendations: string[] = [];

    if (state.primary === 'anxious' || state.arousal > 0.7) {
      recommendations.push('Try deep breathing exercises (4-7-8 technique)');
      recommendations.push('Consider a short break or meditation');
    }

    if (state.primary === 'sad' && state.valence < -0.5) {
      recommendations.push('Engage in a mood-lifting activity');
      recommendations.push('Connect with friends or listen to uplifting music');
    }

    if (biometrics.heartRate && biometrics.heartRate > 100) {
      recommendations.push('Your heart rate is elevated - consider slowing down');
    }

    if (state.primary === 'focused' || state.arousal < 0.3) {
      recommendations.push('Great focus! Maintain this calm state');
    }

    if (state.primary === 'excited' && state.intensity > 0.8) {
      recommendations.push('Channel this energy into creative work');
    }

    return recommendations;
  }

  /**
   * Generate behavioral insights
   */
  private generateInsights(state: EmotionalState): string[] {
    const insights: string[] = [];

    insights.push(`Primary emotion: ${state.primary} (${Math.round(state.intensity * 100)}% intensity)`);
    
    if (state.valence > 0.5) {
      insights.push('You\'re experiencing positive emotions - great time for social interaction');
    } else if (state.valence < -0.5) {
      insights.push('You may benefit from self-care activities');
    }

    if (state.arousal > 0.7) {
      insights.push('High energy levels detected - optimal for physical or creative activities');
    } else if (state.arousal < 0.3) {
      insights.push('Low arousal - ideal for analytical or meditative tasks');
    }

    return insights;
  }

  /**
   * Calculate confidence in emotion detection
   */
  private calculateConfidence(biometrics: BiometricData): number {
    let confidence = 0.5;

    if (biometrics.heartRate) confidence += 0.15;
    if (biometrics.hrv) confidence += 0.15;
    if (biometrics.gsr) confidence += 0.1;
    if (biometrics.respirationRate) confidence += 0.05;
    if (biometrics.skinTemperature) confidence += 0.05;

    return Math.min(confidence, 0.95);
  }

  /**
   * Add emotional state to user history
   */
  private addToHistory(userId: string, state: EmotionalState): void {
    const history = this.emotionHistory.get(userId) || [];
    history.push(state);
    
    // Keep only last 100 states
    if (history.length > 100) {
      history.shift();
    }

    this.emotionHistory.set(userId, history);
  }

  /**
   * Generate emotion heatmap for visualization
   */
  async generateHeatmap(userId: string, timeRange?: { start: Date; end: Date }): Promise<EmotionHeatmap[]> {
    const history = this.emotionHistory.get(userId);
    if (!history) return [];

    const filtered = timeRange 
      ? history.filter(s => s.timestamp >= timeRange.start && s.timestamp <= timeRange.end)
      : history;

    // Quantum clustering simulation
    return this.clusterEmotions(userId, filtered);
  }

  /**
   * Quantum-enhanced emotion clustering
   */
  private clusterEmotions(userId: string, states: EmotionalState[]): EmotionHeatmap[] {
    const heatmaps: EmotionHeatmap[] = [];

    // Group by time windows (15-minute intervals)
    const windowSize = 15 * 60 * 1000; // 15 minutes in ms
    const windows = new Map<number, EmotionalState[]>();

    states.forEach(state => {
      const windowKey = Math.floor(state.timestamp.getTime() / windowSize);
      const windowStates = windows.get(windowKey) || [];
      windowStates.push(state);
      windows.set(windowKey, windowStates);
    });

    // Create heatmap for each window
    windows.forEach((windowStates, windowKey) => {
      const emotions: Record<EmotionType, number> = {
        joy: 0, calm: 0, excited: 0, focused: 0, sad: 0, anxious: 0, neutral: 0
      };

      windowStates.forEach(state => {
        emotions[state.primary] += state.intensity;
      });

      heatmaps.push({
        userId,
        timestamp: new Date(windowKey * windowSize),
        emotions,
        context: this.inferContext(windowStates)
      });
    });

    return heatmaps;
  }

  /**
   * Infer contextual information from emotional patterns
   */
  private inferContext(states: EmotionalState[]): string {
    const avgArousal = states.reduce((sum, s) => sum + s.arousal, 0) / states.length;
    const avgValence = states.reduce((sum, s) => sum + s.valence, 0) / states.length;

    if (avgArousal > 0.6 && avgValence > 0.3) return 'High-energy positive activity';
    if (avgArousal < 0.3 && avgValence > 0.3) return 'Calm, peaceful period';
    if (avgArousal > 0.6 && avgValence < -0.3) return 'Stressful or challenging activity';
    if (avgArousal < 0.3 && avgValence < -0.3) return 'Low mood, rest period';
    
    return 'Mixed emotional state';
  }

  /**
   * Get emotion statistics for user
   */
  getEmotionStats(userId: string): Record<EmotionType, number> {
    const history = this.emotionHistory.get(userId);
    if (!history) {
      return { joy: 0, calm: 0, excited: 0, focused: 0, sad: 0, anxious: 0, neutral: 0 };
    }

    const stats: Record<EmotionType, number> = {
      joy: 0, calm: 0, excited: 0, focused: 0, sad: 0, anxious: 0, neutral: 0
    };

    history.forEach(state => {
      stats[state.primary]++;
    });

    // Normalize to percentages
    const total = history.length;
    Object.keys(stats).forEach(key => {
      stats[key as EmotionType] = (stats[key as EmotionType] / total) * 100;
    });

    return stats;
  }
}

export const emotionBI = new EmotionBI();

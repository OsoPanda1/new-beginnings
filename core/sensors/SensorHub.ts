/**
 * 🎮 Sensor Hub - TAMV MD-X4™
 * XR tracking, biometric sensors, and spatial audio integration
 */

export interface XRTrackingData {
  hands?: {
    left?: HandPose;
    right?: HandPose;
  };
  eyes?: EyeTracking;
  head?: HeadPose;
  position?: { x: number; y: number; z: number };
  orientation?: { x: number; y: number; z: number; w: number };
}

export interface HandPose {
  joints: Array<{ x: number; y: number; z: number }>;
  gesture?: string;
  confidence: number;
}

export interface EyeTracking {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  gazeDirection: { x: number; y: number; z: number };
  pupilDilation: number;
  blinkRate: number;
}

export interface HeadPose {
  position: { x: number; y: number; z: number };
  rotation: { pitch: number; yaw: number; roll: number };
}

export interface SpatialAudioConfig {
  position: { x: number; y: number; z: number };
  orientation: { x: number; y: number; z: number; w: number };
  emotionalFilter?: 'calm' | 'energetic' | 'focused' | 'neutral';
  hrtfEnabled: boolean;
}

export interface HapticPattern {
  intensity: number; // 0-1
  duration: number; // ms
  frequency?: number; // Hz
  waveform?: 'sine' | 'square' | 'triangle' | 'sawtooth';
}

class SensorHub {
  private xrSession?: XRSession | undefined;
  private audioContext?: AudioContext;
  private spatialPanner?: PannerNode;
  private biometricDevices: Map<string, any> = new Map();
  private isXRActive: boolean = false;

  /**
   * Initialize WebXR session
   */
  async initializeXR(mode: 'immersive-vr' | 'immersive-ar' = 'immersive-vr'): Promise<boolean> {
    if (!('xr' in navigator)) {
      console.warn('WebXR not supported');
      return false;
    }

    try {
      const supported = await navigator.xr?.isSessionSupported(mode);
      if (!supported) {
        console.warn(`${mode} not supported`);
        return false;
      }

      this.xrSession = await navigator.xr?.requestSession(mode, {
        requiredFeatures: ['hand-tracking', 'eye-tracking', 'local-floor'],
        optionalFeatures: ['bounded-floor', 'depth-sensing']
      });

      this.isXRActive = true;
      console.log('✅ XR session initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize XR:', error);
      return false;
    }
  }

  /**
   * Get current XR tracking data
   */
  async getXRTrackingData(): Promise<XRTrackingData | null> {
    if (!this.xrSession || !this.isXRActive) {
      return null;
    }

    // Simulated tracking data (real implementation would use XRFrame)
    return {
      hands: {
        left: this.simulateHandPose('left'),
        right: this.simulateHandPose('right')
      },
      eyes: this.simulateEyeTracking(),
      head: this.simulateHeadPose(),
      position: { x: 0, y: 1.6, z: 0 },
      orientation: { x: 0, y: 0, z: 0, w: 1 }
    };
  }

  /**
   * Connect to Bluetooth biometric device
   */
  async connectBiometricDevice(type: 'heartRate' | 'gsr' | 'eeg'): Promise<boolean> {
    if (!('bluetooth' in navigator)) {
      console.warn('Bluetooth API not supported');
      return false;
    }

    try {
      const serviceUUIDs: Record<string, string> = {
        heartRate: '0x180d',
        gsr: '0x181a',
        eeg: '0x181b'
      };

      const bluetooth = (navigator as any).bluetooth;
      if (!bluetooth) return false;

      const device = await bluetooth.requestDevice({
        filters: [{ services: [serviceUUIDs[type]] }]
      });

      const server = await device.gatt?.connect();
      this.biometricDevices.set(type, server);

      console.log(`✅ Connected to ${type} device`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${type} device:`, error);
      return false;
    }
  }

  /**
   * Read biometric data
   */
  async readBiometricData(type: 'heartRate' | 'gsr' | 'eeg'): Promise<number | null> {
    const device = this.biometricDevices.get(type);
    if (!device) {
      console.warn(`${type} device not connected`);
      return null;
    }

    // Simulated biometric readings
    const simulatedData: Record<string, number> = {
      heartRate: 60 + Math.random() * 40,
      gsr: Math.random(),
      eeg: Math.random() * 100
    };

    return simulatedData[type];
  }

  /**
   * Initialize spatial audio
   */
  async initializeSpatialAudio(): Promise<boolean> {
    try {
      this.audioContext = new AudioContext();
      this.spatialPanner = this.audioContext.createPanner();

      // Configure HRTF
      this.spatialPanner.panningModel = 'HRTF';
      this.spatialPanner.distanceModel = 'inverse';
      this.spatialPanner.refDistance = 1;
      this.spatialPanner.maxDistance = 10000;
      this.spatialPanner.rolloffFactor = 1;
      this.spatialPanner.coneInnerAngle = 360;
      this.spatialPanner.coneOuterAngle = 0;
      this.spatialPanner.coneOuterGain = 0;

      console.log('🔊 Spatial audio initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize spatial audio:', error);
      return false;
    }
  }

  /**
   * Update spatial audio configuration
   */
  updateSpatialAudio(config: SpatialAudioConfig): void {
    if (!this.spatialPanner || !this.audioContext) {
      console.warn('Spatial audio not initialized');
      return;
    }

    // Update listener position
    const listener = this.audioContext.listener;
    if (listener.positionX) {
      listener.positionX.value = config.position.x;
      listener.positionY.value = config.position.y;
      listener.positionZ.value = config.position.z;
    }

    // Update listener orientation
    if (listener.forwardX) {
      const { x, y, z, w } = config.orientation;
      // Convert quaternion to forward/up vectors
      listener.forwardX.value = 2 * (x * z + w * y);
      listener.forwardY.value = 2 * (y * z - w * x);
      listener.forwardZ.value = 1 - 2 * (x * x + y * y);
    }

    // Apply emotional filter
    if (config.emotionalFilter) {
      this.applyEmotionalFilter(config.emotionalFilter);
    }
  }

  /**
   * Apply emotional audio filter
   */
  private applyEmotionalFilter(emotion: 'calm' | 'energetic' | 'focused' | 'neutral'): void {
    if (!this.audioContext) return;

    // Create filter based on emotion
    const filter = this.audioContext.createBiquadFilter();

    switch (emotion) {
      case 'calm':
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;
        break;
      case 'energetic':
        filter.type = 'highpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;
        break;
      case 'focused':
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;
        break;
      default:
        filter.type = 'allpass';
    }

    // Connect filter to panner
    if (this.spatialPanner) {
      this.spatialPanner.connect(filter);
      filter.connect(this.audioContext.destination);
    }
  }

  /**
   * Trigger haptic feedback
   */
  async triggerHaptic(pattern: HapticPattern, hand?: 'left' | 'right'): Promise<void> {
    if (!this.xrSession) {
      // Fallback to Gamepad API for non-XR haptics
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads.find(gp => gp && gp.hapticActuators);
      
      if (gamepad?.hapticActuators?.[0]) {
        await gamepad.hapticActuators[0].pulse(pattern.intensity, pattern.duration);
      } else {
        console.warn('No haptic device available');
      }
      return;
    }

    // XR-specific haptic implementation
    console.log(`🎮 Haptic triggered: ${hand || 'both hands'}, intensity: ${pattern.intensity}`);
  }

  /**
   * Get sensor fusion data (combined XR + biometric)
   */
  async getSensorFusionData(): Promise<{
    xr: XRTrackingData | null;
    biometrics: {
      heartRate?: number;
      gsr?: number;
      eeg?: number;
    };
    timestamp: Date;
  }> {
    const [xr, heartRate, gsr, eeg] = await Promise.all([
      this.getXRTrackingData(),
      this.readBiometricData('heartRate'),
      this.readBiometricData('gsr'),
      this.readBiometricData('eeg')
    ]);

    return {
      xr,
      biometrics: {
        ...(heartRate !== null && { heartRate }),
        ...(gsr !== null && { gsr }),
        ...(eeg !== null && { eeg })
      },
      timestamp: new Date()
    };
  }

  // ============ SIMULATION METHODS ============

  private simulateHandPose(hand: 'left' | 'right'): HandPose {
    const joints = Array.from({ length: 25 }, (_, i) => ({
      x: Math.random() * 0.2 - 0.1,
      y: Math.random() * 0.2 - 0.1,
      z: Math.random() * 0.2 - 0.1
    }));

    const gestures = ['open', 'fist', 'point', 'peace', 'thumbsup'];
    const gesture = gestures[Math.floor(Math.random() * gestures.length)];

    return {
      joints,
      gesture,
      confidence: 0.8 + Math.random() * 0.2
    };
  }

  private simulateEyeTracking(): EyeTracking {
    return {
      leftEye: { x: Math.random() * 0.1 - 0.05, y: Math.random() * 0.1 - 0.05 },
      rightEye: { x: Math.random() * 0.1 - 0.05, y: Math.random() * 0.1 - 0.05 },
      gazeDirection: { x: 0, y: 0, z: -1 },
      pupilDilation: 3 + Math.random() * 2,
      blinkRate: 15 + Math.random() * 10
    };
  }

  private simulateHeadPose(): HeadPose {
    return {
      position: { x: 0, y: 1.6, z: 0 },
      rotation: {
        pitch: Math.random() * 20 - 10,
        yaw: Math.random() * 40 - 20,
        roll: Math.random() * 10 - 5
      }
    };
  }

  /**
   * Shutdown sensor hub
   */
  async shutdown(): Promise<void> {
    if (this.xrSession) {
      await this.xrSession.end();
      this.isXRActive = false;
    }

    if (this.audioContext) {
      await this.audioContext.close();
    }

    this.biometricDevices.clear();
    console.log('🛑 Sensor Hub shutdown complete');
  }
}

export const sensorHub = new SensorHub();

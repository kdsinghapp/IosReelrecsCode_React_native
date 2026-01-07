import RNFS from 'react-native-fs';

class FileLogger {
  private logFilePath: string;
  private isInitialized: boolean = false;
  private logBuffer: string[] = [];
  private writeTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Store logs in the Documents directory so they persist
    this.logFilePath = `${RNFS.DocumentDirectoryPath}/app_debug_logs.txt`;
    this.initialize();
  }

  private async initialize() {
    try {
      // Clear the log file on app start
      await RNFS.writeFile(this.logFilePath, `=== App Started: ${new Date().toISOString()} ===\n`, 'utf8');
      this.isInitialized = true;
      console.log(`[FileLogger] Initialized. Logs will be saved to: ${this.logFilePath}`);

      // Write any buffered logs
      if (this.logBuffer.length > 0) {
        await this.flushBuffer();
      }
    } catch (error) {
      console.error('[FileLogger] Failed to initialize:', error);
    }
  }

  private async flushBuffer() {
    if (this.logBuffer.length === 0) return;

    const logsToWrite = [...this.logBuffer];
    this.logBuffer = [];

    try {
      const content = logsToWrite.join('\n') + '\n';
      await RNFS.appendFile(this.logFilePath, content, 'utf8');
    } catch (error) {
      console.error('[FileLogger] Failed to write logs:', error);
      // Re-add to buffer if write failed
      this.logBuffer = [...logsToWrite, ...this.logBuffer];
    }
  }

  private scheduleWrite() {
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    // Batch writes every 100ms to avoid too many file operations
    this.writeTimer = setTimeout(() => {
      this.flushBuffer();
    }, 100);
  }

  log(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}${data ? ': ' + JSON.stringify(data, null, 2) : ''}`;

    // Always log to console
    console.log(logEntry);

    // Add to buffer for file writing
    this.logBuffer.push(logEntry);

    if (this.isInitialized) {
      this.scheduleWrite();
    }
  }

  debug(message: string, data?: any) {
    this.log('DEBUG', message, data);
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }

  // Get the log file path (useful for displaying in UI)
  getLogPath(): string {
    return this.logFilePath;
  }

  // Read current logs (useful for displaying in UI)
  async readLogs(): Promise<string> {
    try {
      if (await RNFS.exists(this.logFilePath)) {
        return await RNFS.readFile(this.logFilePath, 'utf8');
      }
      return 'No logs available';
    } catch (error) {
      return `Failed to read logs: ${error}`;
    }
  }

  // Clear logs manually if needed
  async clearLogs() {
    try {
      await RNFS.writeFile(this.logFilePath, `=== Logs Cleared: ${new Date().toISOString()} ===\n`, 'utf8');
      this.logBuffer = [];
      console.log('[FileLogger] Logs cleared');
    } catch (error) {
      console.error('[FileLogger] Failed to clear logs:', error);
    }
  }
}

// Export singleton instance
export const fileLogger = new FileLogger();
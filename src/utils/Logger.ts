/**
 * Enhanced Logger for React Native 0.77
 * Provides colored console output and captures logs for display
 */

class Logger {
  private static logs: Array<{
    level: 'log' | 'warn' | 'error' | 'info' | 'debug';
    message: string;
    timestamp: Date;
    data?: any;
  }> = [];

  private static colors = {
    log: '\x1b[37m',    // white
    info: '\x1b[36m',   // cyan
    warn: '\x1b[33m',   // yellow
    error: '\x1b[31m',  // red
    debug: '\x1b[35m',  // magenta
    reset: '\x1b[0m'
  };

  private static formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const color = this.colors[level as keyof typeof this.colors] || this.colors.log;
    const reset = this.colors.reset;

    let formatted = `${color}[${timestamp}] [${level.toUpperCase()}] ${message}${reset}`;
    if (data) {
      formatted += '\n' + JSON.stringify(data, null, 2);
    }
    return formatted;
  }

  static log(message: string, data?: any) {
    const formatted = this.formatMessage('log', message, data);
    console.log(formatted);
    this.logs.push({ level: 'log', message, timestamp: new Date(), data });
  }

  static info(message: string, data?: any) {
    const formatted = this.formatMessage('info', message, data);
    console.info(formatted);
    this.logs.push({ level: 'info', message, timestamp: new Date(), data });
  }

  static warn(message: string, data?: any) {
    const formatted = this.formatMessage('warn', message, data);
    console.warn(formatted);
    this.logs.push({ level: 'warn', message, timestamp: new Date(), data });
  }

  static error(message: string, data?: any) {
    const formatted = this.formatMessage('error', message, data);
    console.error(formatted);
    this.logs.push({ level: 'error', message, timestamp: new Date(), data });
  }

  static debug(message: string, data?: any) {
    if (__DEV__) {
      const formatted = this.formatMessage('debug', message, data);
      console.log(formatted);
      this.logs.push({ level: 'debug', message, timestamp: new Date(), data });
    }
  }

  static getLogs() {
    return this.logs;
  }

  static clearLogs() {
    this.logs = [];
  }
}

export default Logger;
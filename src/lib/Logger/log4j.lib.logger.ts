import { Injectable } from '@nestjs/common';
import { getLogger, configure, addLayout, levels } from 'log4js';
import { ClsService } from 'nestjs-cls';
import { ClsConstants } from '../../consts/cls.constants';
import { TransactionLogObject } from './dto.lib.logger';
import * as SafeJsonStringify from 'json-stringify-safe';

@Injectable()
export class Logger {
  constructor(private clsService: ClsService) {
    const DEFAULT_MAX_LOG_SIZE = '209715200';
    // max number of log files 2GB total in size
    const DEFAULT_MAX_LOG_BACKUP = '1024';
    addLayout('json', () => {
      return function (logEvent): string {
        const { startTime, level, data } = logEvent;
        let parsedData;
        try {
          parsedData = JSON.parse(data[0]);
        } catch (e) {
          // ignore
        }
        const levelStr = level.levelStr;
        const obj = { level: levelStr, startTime, message: parsedData };
        return JSON.stringify(obj);
      };
    });
    const transactionAppenders = ['console', 'transactionLogs'];

    const messageAppenders = ['console', 'messageLogs'];
    // This is not the final appenders , we will have conversation with devops team
    configure({
      appenders: {
        console: { type: 'console', layout: { type: 'json' } },
        transactionLogs: {
          layout: { type: 'json' },
          type: 'file',
          filename: 'logs/transactions-' + process.pid + '.log',
          category: 'transaction',
          maxLogSize: parseInt(process.env.LOG_MAX_LOG_Size || DEFAULT_MAX_LOG_SIZE),
          backups: parseInt(process.env.LOG_MAX_LOG_BACKUP || DEFAULT_MAX_LOG_BACKUP),
          keepFileExt: true,
        },
        messageLogs: {
          layout: { type: 'json' },
          type: 'file',
          filename: 'logs/message-' + process.pid + '.log',
          category: 'message',
          maxLogSize: parseInt(process.env.LOG_MAX_LOG_Size || DEFAULT_MAX_LOG_SIZE),
          backups: parseInt(process.env.LOG_MAX_LOG_BACKUP || DEFAULT_MAX_LOG_BACKUP),
          keepFileExt: true,
        },
      },
      categories: {
        default: { appenders: ['console'], level: levels.ALL.levelStr },
        transaction: {
          appenders: transactionAppenders,
          level: levels.ALL.levelStr,
        },
        message: { appenders: messageAppenders, level: levels.ALL.levelStr },
      },
    });
  }

  error(message: unknown, ...args: unknown[]): void {
    if (this.notContainsTraceID()) {
      getLogger().error(this.createLoggedObject(message, args));
    } else if (message instanceof TransactionLogObject) {
      getLogger('transaction').error(this.createLoggedObject(message));
    } else {
      getLogger('message').error(this.createLoggedObject(message, args));
    }
  }

  info(message: unknown, ...args: unknown[]): void {
    if (this.notContainsTraceID()) {
      getLogger().info(this.createLoggedObject(message));
    } else if (message instanceof TransactionLogObject) {
      getLogger('transaction').info(this.createLoggedObject(message));
    } else {
      getLogger('message').info(this.createLoggedObject(message, args));
    }
  }

  warn(message: unknown, ...args: unknown[]): void {
    if (this.notContainsTraceID()) {
      getLogger().warn(this.createLoggedObject(message));
    } else if (message instanceof TransactionLogObject) {
      getLogger('transaction').warn(this.createLoggedObject(message));
    } else {
      getLogger('message').warn(this.createLoggedObject(message, args));
    }
  }

  debug(message: unknown, ...args: unknown[]): void {
    if (this.notContainsTraceID()) {
      getLogger().debug(this.createLoggedObject(message));
    } else if (message instanceof TransactionLogObject) {
      getLogger('transaction').debug(this.createLoggedObject(message));
    } else {
      getLogger('message').debug(this.createLoggedObject(message, args));
    }
  }

  trace(message: unknown, ...args: unknown[]): void {
    if (this.notContainsTraceID()) {
      getLogger().trace(this.createLoggedObject(message));
    } else if (message instanceof TransactionLogObject) {
      getLogger('transaction').trace(this.createLoggedObject(message));
    } else {
      getLogger('message').trace(this.createLoggedObject(message, args));
    }
  }

  private createLoggedObject(message: unknown, ...args: unknown[]): unknown {
    const traceId = this.clsService.get<string>(ClsConstants.TRACE_ID);
    const spanId = this.clsService.get<string>(ClsConstants.SPAN_ID);
    const serviceName = this.clsService.get<string>(ClsConstants.SERVICE_NAME);
    let obj: Record<string, unknown> = {};
    if (typeof message == 'string') {
      obj = {
        label: 'message',
        traceId: traceId,
        spanId: spanId,
        serviceName: serviceName,
        message: { message },
        additionalInfo: args,
      };
    } else if (!(message instanceof TransactionLogObject)) {
      obj = {
        label: 'message',
        traceId: traceId,
        spanId: spanId,
        serviceName: serviceName,
        message: message,
        additionalInfo: args,
      };
    } else {
      obj = {
        label: 'transaction',
        traceId: traceId,
        spanId: spanId,
        serviceName: serviceName,
        ...message,
        additionalInfo: args,
      };
    }

    return SafeJsonStringify(obj);
  }

  private notContainsTraceID(): boolean {
    const traceId = this.clsService.get<string>(ClsConstants.TRACE_ID);
    return traceId == undefined;
  }
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logging, Log } from "@google-cloud/logging";

export enum Severity {
  DEFAULT = 0,
  DEBUG = 100,
  INFO = 200,
  NOTICE = 300,
  WARNING = 400,
  ERROR = 500,
  CRITICAL = 600,
  ALERT = 700,
  EMERGENCY = 800
}

export class Logger {
  private logging: Log;
  private level: Severity[];
  constructor(private name: string, level: Severity | Severity[]) {
    this.level = (level instanceof Array) ? level : [level];
    this.logging = (new Logging()).log(name);
  }

  private shouldWrite(severity: Severity): boolean {
    if (this.level.length == 0) return true;
    if (this.level.length == 1) return this.level[0] <= severity;
    return (this.level[0] <= severity && severity <= this.level[this.level.length - 1]);
  }

  private async log(payload: any, labels: { [key: string]: string } = {}, severity = 'INFO'): Promise<any> {
    const entry = this.logging.entry({ labels, severity }, payload);
    return await this.logging.write(entry);
  }
  private async _log(severity: Severity, payload: any, component: string | { [key: string]: string } = {}) {
    if (this.shouldWrite(severity)) return;
    const labels = (typeof component == 'string') ? { component } : component;
    return await this.log(payload, labels, Severity[severity]);
  }

  public async debug(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.DEBUG, payload, component);
  }
  public async info(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.INFO, payload, component);
  }
  public async notice(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.NOTICE, payload, component);
  }
  public async warning(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.WARNING, payload, component);
  }
  public async error(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.ERROR, payload, component);
  }
  public async critical(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.CRITICAL, payload, component);
  }
  public async alert(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.ALERT, payload, component);
  }
  public async emergency(payload: any, component: string | { [key: string]: string } = {}): Promise<any> {
    return await this._log(Severity.NOTICE, payload, component);
  }
}

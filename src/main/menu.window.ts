import { I18nService } from "jslib-common/abstractions/i18n.service";
import { MessagingService } from "jslib-common/abstractions/messaging.service";

import { isMacAppStore } from "jslib-electron/utils";
import { WindowMain } from "jslib-electron/window.main";

import { IMenubarMenu } from "./menubar";

import { MenuItemConstructorOptions } from "electron";

export class WindowMenu implements IMenubarMenu {
  readonly id: string;

  get label(): string {
    return this.localize("window");
  }

  get items(): MenuItemConstructorOptions[] {
    if (!isMacAppStore()) {
      return [this.hideToMenu, this.alwaysOnTop];
    }

    return [
      this.minimize,
      this.hideToMenu,
      this.alwaysOnTop,
      this.zoom,
      this.separator,
      this.bringAllToFront,
      this.close,
    ];
  }

  private readonly _i18nService: I18nService;
  private readonly _messagingService: MessagingService;
  private readonly _window: WindowMain;

  constructor(
    i18nService: I18nService,
    messagingService: MessagingService,
    windowMain: WindowMain
  ) {
    this._i18nService = i18nService;
    this._messagingService = messagingService;
    this._window = windowMain;
  }

  private get minimize(): MenuItemConstructorOptions {
    return {
      id: "minimize",
      label: this.localize("minimize"),
      role: "minimize",
      visible: isMacAppStore(),
    };
  }

  private get hideToMenu(): MenuItemConstructorOptions {
    return {
      id: "hideToMenu",
      label: this.localize(isMacAppStore() ? "hideToMenuBar" : "hideToTray"),
      click: () => this.sendMessage("hideToTray"),
      accelerator: "CmdOrCtrl+Shift+M",
    };
  }

  private get alwaysOnTop(): MenuItemConstructorOptions {
    return {
      id: "alwaysOnTop",
      label: this.localize("alwaysOnTop"),
      type: "checkbox",
      checked: this._window.win.isAlwaysOnTop(),
      click: () => this._window.toggleAlwaysOnTop(),
      accelerator: "CmdOrCtrl+Shift+T",
    };
  }

  private get zoom(): MenuItemConstructorOptions {
    return {
      id: "zoom",
      label: this.localize("zoom"),
      role: "zoom",
      visible: isMacAppStore(),
    };
  }

  private get separator(): MenuItemConstructorOptions {
    return { type: "separator" };
  }

  private get bringAllToFront(): MenuItemConstructorOptions {
    return {
      id: "bringAllToFront",
      label: this.localize("bringAllToFront"),
      role: "front",
      visible: isMacAppStore(),
    };
  }

  private get close(): MenuItemConstructorOptions {
    return {
      id: "close",
      label: this.localize("close"),
      role: "close",
      visible: isMacAppStore(),
    };
  }

  private localize(s: string) {
    return this._i18nService.t(s);
  }

  private sendMessage(message: string, args?: any) {
    this._messagingService.send(message, args);
  }
}

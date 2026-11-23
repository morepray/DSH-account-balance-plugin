window.__ModuleLoader__.load({
  id: '@local/dsh-account-balance',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owned by this plugin. */
    const NS = 'accountBalance';
    /** Sidebar-foot list beside Settings. */
    const SLOT = 'sidebar.footer.action';
    /** Host route that reads today's Platform spend. */
    const USAGE_PATH = '/account-balance/usage';
    /** Host route that reads this repository's published version. */
    const UPDATE_PATH = '/account-balance/update';
    /** The account Remote sends this client identity with each Platform read. */
    const CLIENT_VERSION = '0.2.1-rc.5';
    /** Keep this in sync with package.json when publishing a release. */
    const PLUGIN_VERSION = '1.7.0';
    /** Browser-local preference: seconds between automatic balance reads; 0 = off. */
    const INTERVAL_KEY = 'dsh.account-balance.refresh-seconds.v1';
    const DEFAULT_INTERVAL_SECONDS = 60;
    const MAX_INTERVAL_SECONDS = 3600;
    /** Browser-local preference: alert when today's spend exceeds this amount; 0 = off. */
    const ALERT_THRESHOLD_KEY = 'dsh.account-balance.alert-threshold.v1';
    /** Browser-local record of the local day and threshold that already alerted. */
    const ALERT_RECORD_KEY = 'dsh.account-balance.alert-record.v1';
    const DEFAULT_ALERT_THRESHOLD = 5;
    const MAX_ALERT_THRESHOLD = 100000;
    /** Browser-local preference: visibility of the character background, 0-100. */
    const HERO_OPACITY_KEY = 'dsh.account-balance.hero-opacity.v1';
    const DEFAULT_HERO_OPACITY = 58;
    const MIN_HERO_OPACITY = 0;
    const MAX_HERO_OPACITY = 100;
    const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;
    const UPDATE_ATTEMPT_GAP_MS = 60_000;

    const en = {
      'balance.label': 'Balance',
      'balance.today': 'Today used',
      'balance.loading': 'Loading…',
      'balance.signedOut': 'Not signed in',
      'balance.failed': 'Retry',
      'balance.usageFailed': 'Unavailable',
      'balance.empty': '—',
      'balance.bonus': 'Bonus credit',
      'balance.autoRefresh': 'Auto-refresh',
      'balance.everySeconds': 'every {seconds}s',
      'balance.refreshHint': 'Click to refresh',
      'balance.contextHint': 'Click the coin for settings and updates',
      'opacity.title': 'Background opacity',
      'opacity.description': 'Character image visibility; 0 hides the image, 100 shows it fully.',
      'opacity.invalid': 'Enter a whole number from 0 to 100.',
      'balance.aria': 'Account balance',
      'alert.title': 'Daily spend alert',
      'alert.body': 'Today used {cost}, above the {threshold} alert line.',
      'alert.dismiss': 'Got it',
      'alert.notificationTitle': 'Daily spend alert',
      'alert.settingTitle': 'Daily spend alert',
      'alert.settingDescription': 'Alert once a day when today\'s spend first exceeds this amount; 0 turns it off.',
      'alert.settingUnit': 'CNY',
      'alert.invalid': 'Enter an amount from 0 to 100000.',
      'alert.over': 'Above the {threshold} alert line.',
      'balance.ariaValue': 'Account balance: {amount}. Click to refresh.',
      'balance.ariaValueWithUsage': 'Account balance: {amount}. Today used: {usage}. Click to refresh.',
      'balance.ariaLoading': 'Account balance is loading',
      'balance.ariaSignedOut': 'Account balance unavailable: not signed in',
      'balance.ariaFailed': 'Account balance could not be read. Click to retry.',
      'settings.title': 'Auto-refresh',
      'settings.description': 'Seconds between automatic balance and today\'s-spend reads; 0 turns auto-refresh off.',
      'settings.unit': 'seconds',
      'settings.invalid': 'Enter a whole number from 0 to 3600.',
      'update.title': 'Plugin update',
      'update.check': 'Check for updates',
      'update.checking': 'Checking…',
      'update.idle': 'Check GitHub for a newer release.',
      'update.latest': 'Up to date (v{version}).',
      'update.available': 'New version v{latest} is available (current v{current}).',
      'update.availableShort': 'Update available: v{version}',
      'update.ahead': 'Local version v{current} is newer than GitHub v{latest}.',
      'update.failed': 'Update check failed. Try again later.',
      'update.hint': 'Uninstall the old version on the Plugins page, then install the new one.',
      'update.open': 'Open GitHub',
      'update.openPlugins': 'Update in Plugins',
      'update.autoCheck': 'Checks GitHub every 6 hours.',
      'menu.title': 'Balance & usage',
      'menu.open': 'Settings & updates',
      'menu.close': 'Close',
      'menu.footer': 'Click the card to refresh · Click the coin to reopen',
    };

    const zh = {
      'balance.label': '余额',
      'balance.today': '今日已用',
      'balance.loading': '读取中…',
      'balance.signedOut': '未登录',
      'balance.failed': '重试',
      'balance.usageFailed': '读取失败',
      'balance.empty': '—',
      'balance.bonus': '赠送余额',
      'balance.autoRefresh': '自动刷新',
      'balance.everySeconds': '每 {seconds} 秒',
      'balance.refreshHint': '点击刷新',
      'balance.contextHint': '点击硬币打开设置与更新',
      'opacity.title': '背景透明度',
      'opacity.description': '角色背景的可见度；0 为不显示图片，100 为完整显示。',
      'opacity.invalid': '请输入 0–100 之间的整数。',
      'balance.aria': '账户余额',
      'alert.title': '今日用量报警',
      'alert.body': '今日已用 {cost}，已超过 {threshold} 报警线。',
      'alert.dismiss': '知道了',
      'alert.notificationTitle': '今日用量报警',
      'alert.settingTitle': '用量报警',
      'alert.settingDescription': '每天首次超过此金额时提醒一次；0 表示关闭。',
      'alert.settingUnit': '元',
      'alert.invalid': '请输入 0–100000 之间的金额。',
      'alert.over': '已超过 {threshold} 报警线。',
      'balance.ariaValue': '账户余额：{amount}。点击刷新。',
      'balance.ariaValueWithUsage': '账户余额：{amount}。今日已用：{usage}。点击刷新。',
      'balance.ariaLoading': '正在读取账户余额',
      'balance.ariaSignedOut': '账户余额不可用：未登录',
      'balance.ariaFailed': '账户余额读取失败，点击重试',
      'settings.title': '自动刷新',
      'settings.description': '自动读取余额和今日用量的间隔（秒）；0 表示关闭。',
      'settings.unit': '秒',
      'settings.invalid': '请输入 0–3600 之间的整数。',
      'update.title': '插件更新',
      'update.check': '检查更新',
      'update.checking': '检查中…',
      'update.idle': '检查 GitHub 上是否有新版本。',
      'update.latest': '已是最新版本（v{version}）。',
      'update.available': '发现新版本 v{latest}（当前 v{current}）。',
      'update.availableShort': '发现新版本：v{version}',
      'update.ahead': '本地版本 v{current} 比 GitHub 上的 v{latest} 新。',
      'update.failed': '检查失败，请稍后重试。',
      'update.hint': '请到 Plugins 页面卸载旧版本后重新安装。',
      'update.open': '打开 GitHub',
      'update.openPlugins': '去 Plugins 更新',
      'update.autoCheck': '每 6 小时自动检查一次 GitHub。',
      'menu.title': '余额与用量',
      'menu.open': '设置与更新',
      'menu.close': '关闭',
      'menu.footer': '点击卡片刷新 · 点击硬币重新打开',
    };

    const HERO_IMAGE = 'data:image/webp;base64,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';
    const css = `
.ab-root { flex: none; width: 100%; min-width: 0; }
.ab-root[data-wide="false"] { width: auto; }
.ab-root[data-wide="true"] { position: relative; display: flex; align-items: center; }
.ab-root[data-wide="true"] .ab-button { flex: 1; width: auto; margin-right: 0; }
.ab-coinButton {
  position: absolute;
  left: 12px;
  top: calc(50% + 4px);
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #ffd77a;
  cursor: pointer;
  z-index: 2;
  -webkit-app-region: no-drag;
}
.ab-coinButton .ab-icon { width: 16px; height: 16px; padding: 5px; }
.ab-coinButton:hover { background: rgba(255, 255, 255, .14); }
.ab-coinButton:focus-visible {
  outline: 2px solid rgba(255, 255, 255, .92);
  outline-offset: 2px;
}
.ab-button {
  box-sizing: border-box;
  width: 100%;
  height: 66px;
  margin: 6px 0 0;
  padding: 7px 12px 7px 50px;
  display: inline-flex;
  position: relative;
  align-items: center;
  gap: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .20);
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    rgba(9, 27, 67, .50) 0%,
    rgba(17, 49, 109, .42) 52%,
    rgba(28, 88, 173, .30) 100%
  );
  box-shadow:
    0 6px 18px rgba(8, 24, 64, .20),
    inset 0 1px 0 rgba(255, 255, 255, .24);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  line-height: 18px;
  text-align: left;
  cursor: pointer;
  isolation: isolate;
  backdrop-filter: blur(8px) saturate(1.08);
  transition: border-color 160ms ease, box-shadow 160ms ease, filter 160ms ease;
  -webkit-app-region: no-drag;
}
.ab-button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: url("${HERO_IMAGE}");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  opacity: var(--ab-hero-opacity, .58);
  filter: saturate(1.12) contrast(1.02);
  pointer-events: none;
}
.ab-button::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(6, 16, 42, .52) 0%,
    rgba(6, 16, 42, .28) 38%,
    rgba(6, 16, 42, .06) 70%,
    rgba(6, 16, 42, .12) 100%
  );
  pointer-events: none;
}
.ab-button:hover {
  border-color: rgba(255, 255, 255, .36);
  box-shadow:
    0 8px 22px rgba(8, 24, 64, .26),
    inset 0 1px 0 rgba(255, 255, 255, .30);
  filter: brightness(1.04);
}
.ab-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, .92);
  outline-offset: -2px;
}
.ab-icon {
  flex: none;
  box-sizing: content-box;
  width: 16px;
  height: 16px;
  padding: 7px;
  display: block;
  border: 1px solid rgba(255, 255, 255, .24);
  border-radius: 50%;
  background: rgba(255, 255, 255, .13);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .18);
  color: #ffd77a;
}
.ab-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ab-row {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.ab-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(219, 233, 255, .82);
  font-size: 11px;
  line-height: 15px;
  letter-spacing: .02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
}
.ab-amount {
  flex: none;
  max-width: 62%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: .01em;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .62);
}
.ab-usage {
  flex: none;
  max-width: 62%;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgba(214, 230, 255, .84);
  font-size: 11.5px;
  line-height: 15px;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 3px rgba(0, 0, 0, .55);
}
.ab-usage-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ab-usage[data-over="true"] {
  color: #ffc14d;
  font-weight: 600;
}
.ab-warning {
  flex: none;
  display: block;
  color: #ffc14d;
}
.ab-usage[data-phase="loading"],
.ab-usage[data-phase="signed-out"] {
  color: rgba(220, 232, 255, .58);
}
.ab-usage[data-phase="error"] { color: #ff9e9e; }
.ab-usage[data-error="true"] { color: #ffc14d; }
.ab-amount[data-phase="loading"],
.ab-amount[data-phase="signed-out"] {
  color: rgba(220, 232, 255, .58);
  font-weight: 400;
}
.ab-amount[data-phase="error"] {
  color: #ff9e9e;
  font-weight: 600;
}
.ab-button[data-phase="error"] .ab-icon { border-color: rgba(255, 158, 158, .60); }
.ab-button[data-refreshing="true"] .ab-icon { animation: ab-pulse 1s ease-in-out infinite; }
.ab-railButton {
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  gap: 1px;
  border: 0;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  box-shadow: none;
  color: var(--dsw-alias-label-primary);
  isolation: auto;
  backdrop-filter: none;
}
.ab-railButton::before,
.ab-railButton::after { content: none; }
.ab-railButton:hover {
  background: var(--dsw-alias-bg-layer-2);
  border-color: transparent;
  box-shadow: none;
  filter: none;
}
.ab-railButton .ab-icon {
  box-sizing: border-box;
  width: 15px;
  height: 15px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--dsw-alias-label-secondary);
}
.ab-railAmount {
  max-width: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-secondary);
  font-size: 8px;
  line-height: 9px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
.ab-railButton[data-phase="error"] .ab-railAmount { color: var(--dsw-alias-state-error-primary); }
.ab-menu-layer { position: fixed; inset: 0; z-index: 1200; pointer-events: auto; }
.ab-menu {
  position: fixed;
  box-sizing: border-box;
  width: min(264px, calc(100vw - 16px));
  max-height: calc(100vh - 140px);
  padding: 10px;
  overflow-y: auto;
  border: .5px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: var(--dsw-elevation-prominent);
  backdrop-filter: var(--dsw-menu-backdrop-filter, blur(18px));
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  transform-origin: left bottom;
  animation: ab-menu-pop 180ms cubic-bezier(.16, 1, .3, 1);
}
.ab-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 6px;
}
.ab-menu-title { font-size: 13px; font-weight: 500; line-height: 18px; }
.ab-menu-close {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 18px;
  line-height: 22px;
  cursor: pointer;
}
.ab-menu-close:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.ab-menu-close:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.ab-menu-body { display: flex; flex-direction: column; }
.ab-menu-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 0;
  border-top: .5px solid var(--dsw-alias-border-l1);
}
.ab-menu-row:first-child { border-top: 0; }
.ab-menu-copy { flex: 1; min-width: 0; }
.ab-menu-label { font-size: 12px; line-height: 17px; }
.ab-menu-hint {
  color: var(--dsw-alias-label-secondary);
  margin-top: 1px;
  font-size: 10.5px;
  line-height: 14px;
}
.ab-menu-error {
  color: var(--dsw-alias-state-error-primary);
  margin-top: 1px;
  font-size: 10.5px;
  line-height: 14px;
}
.ab-menu-warn {
  color: var(--dsw-alias-state-warn-primary);
  margin-top: 1px;
  font-size: 10.5px;
  line-height: 14px;
}
.ab-menu-control { flex: none; display: flex; align-items: center; gap: 4px; }
.ab-menu-input {
  box-sizing: border-box;
  width: 60px;
  height: 26px;
  padding: 0 6px;
  border: .5px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.ab-menu-input:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.ab-menu-unit { color: var(--dsw-alias-label-secondary); font-size: 12px; white-space: nowrap; }
.ab-menu-actions {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.ab-menu-button {
  height: 26px;
  padding: 0 9px;
  border: .5px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
}
.ab-menu-button:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.ab-menu-button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.ab-menu-button:disabled { opacity: .55; cursor: default; }
.ab-menu-button-primary { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.ab-menu-link {
  display: inline-block;
  margin-top: 3px;
  color: var(--dsw-alias-brand-primary);
  font-size: 10.5px;
  line-height: 14px;
  text-decoration: none;
}
.ab-menu-link:hover { text-decoration: underline; }
.ab-menu-footer {
  margin-top: 6px;
  padding-top: 6px;
  border-top: .5px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-tertiary);
  font-size: 10.5px;
  line-height: 14px;
}
.ab-update-available { color: var(--dsw-alias-state-success-primary); }
.ab-update-failed { color: var(--dsw-alias-state-error-primary); }
.ab-update-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-state-warn-primary);
  box-shadow: 0 0 0 2px rgba(8, 20, 48, .72);
}
.ab-railButton .ab-update-dot {
  top: 4px;
  right: 4px;
  box-shadow: 0 0 0 2px var(--dsw-specific-sidebar-fill);
}
@keyframes ab-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes ab-menu-pop {
  from { opacity: 0; transform: translateY(8px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ab-button[data-refreshing="true"] .ab-icon { animation: none; }
  .ab-menu { animation: none; }
}
`;

    function symbolFor(currency) {
      if (currency === 'CNY') return '¥';
      if (currency === 'USD') return '$';
      return `${currency} `;
    }

    function addCommas(value) {
      const [integer, fraction] = value.split('.');
      return `${Number(integer).toLocaleString()}.${fraction}`;
    }

    /** Platform Web's two-decimal and sub-cent display rules. */
    function formatBalance(amount, symbol) {
      const value = Number(amount);
      if (!Number.isFinite(value)) return `${symbol}${amount}`;
      if (value === 0) return `${symbol}0.00`;
      if (value < 0) {
        return `-${symbol}${value > -0.01 ? '0.01' : addCommas(Math.abs(value).toFixed(2))}`;
      }
      if (value < 0.01) return `<${symbol}0.01`;
      return `${symbol}${addCommas((Math.trunc(value * 100) / 100).toFixed(2))}`;
    }

    function formatWallets(wallets) {
      if (!Array.isArray(wallets) || wallets.length === 0) return '';
      return wallets
        .map((wallet) => formatBalance(wallet.balance, symbolFor(wallet.currency)))
        .join(' · ');
    }

    /** A rail-sized amount keeps the integer part and grouping; the tooltip has the exact value. */
    function formatCompactWallets(wallets) {
      if (!Array.isArray(wallets) || wallets.length === 0) return '—';
      const wallet = wallets.find((item) => item.currency === 'CNY') ?? wallets[0];
      const value = Number(wallet.balance);
      const symbol = symbolFor(wallet.currency);
      if (!Number.isFinite(value)) return symbol;
      const sign = value < 0 ? '-' : '';
      return `${sign}${symbol}${Math.floor(Math.abs(value)).toLocaleString()}`;
    }

    /** A small Bilibili-style gold coin with a white B, drawn from simple strokes. */
    function CoinIcon({ size }) {
      return h(
        'svg',
        {
          className: 'ab-icon',
          viewBox: '0 0 16 16',
          width: size,
          height: size,
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('circle', {
          cx: '8',
          cy: '8',
          r: '6.15',
          fill: '#F5C542',
          stroke: '#D39B13',
          strokeWidth: '0.9',
        }),
        h('path', {
          d: 'M4.2 5.4a4.6 4.6 0 0 1 2.9-1.85',
          fill: 'none',
          stroke: '#FFE9A6',
          strokeWidth: '0.7',
          strokeLinecap: 'round',
          opacity: '0.9',
        }),
        h('path', {
          d: 'M6.45 5.25v5.5M6.45 5.25h2.05a1.35 1.35 0 0 1 0 2.7H6.45M6.45 7.95h2.3a1.4 1.4 0 0 1 0 2.8H6.45',
          fill: 'none',
          stroke: '#FFFFFF',
          strokeWidth: '1',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    /** A small amber warning triangle used inline beside the daily spend. */
    function WarningIcon({ size = 12 }) {
      return h(
        'svg',
        {
          className: 'ab-warning',
          viewBox: '0 0 16 16',
          width: size,
          height: size,
          'aria-hidden': 'true',
          focusable: 'false',
        },
        h('path', {
          d: 'M7.1 2.25a1 1 0 0 1 1.8 0l5.35 9.7a1 1 0 0 1-.9 1.5H2.65a1 1 0 0 1-.9-1.5l5.35-9.7Z',
          fill: 'currentColor',
        }),
        h('path', {
          d: 'M8 5.9v3.7',
          fill: 'none',
          stroke: '#fff',
          strokeWidth: '1.6',
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M8 11.6h.01',
          fill: 'none',
          stroke: '#fff',
          strokeWidth: '1.8',
          strokeLinecap: 'round',
        }),
      );
    }

    function parseVersion(value) {
      const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(String(value).trim());
      if (match === null) return null;
      return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        pre: match[4] ?? '',
      };
    }

    function compareVersions(left, right) {
      const a = parseVersion(left);
      const b = parseVersion(right);
      if (a === null || b === null) return 0;
      if (a.major !== b.major) return a.major - b.major;
      if (a.minor !== b.minor) return a.minor - b.minor;
      if (a.patch !== b.patch) return a.patch - b.patch;
      if (a.pre === b.pre) return 0;
      if (a.pre === '') return 1;
      if (b.pre === '') return -1;
      return a.pre < b.pre ? -1 : 1;
    }

    function clampIntervalSeconds(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return DEFAULT_INTERVAL_SECONDS;
      return Math.max(0, Math.min(MAX_INTERVAL_SECONDS, Math.round(number)));
    }

    function readIntervalSeconds() {
      try {
        const raw = globalThis.localStorage?.getItem(INTERVAL_KEY);
        if (raw === null || raw === undefined || raw.trim() === '') return DEFAULT_INTERVAL_SECONDS;
        return clampIntervalSeconds(raw);
      } catch {
        return DEFAULT_INTERVAL_SECONDS;
      }
    }

    function writeIntervalSeconds(value) {
      try {
        globalThis.localStorage?.setItem(INTERVAL_KEY, String(value));
      } catch {
        // A browser with storage disabled keeps the session value only.
      }
    }

    function clampHeroOpacity(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return DEFAULT_HERO_OPACITY;
      return Math.max(MIN_HERO_OPACITY, Math.min(MAX_HERO_OPACITY, Math.round(number)));
    }

    function readHeroOpacity() {
      try {
        const raw = globalThis.localStorage?.getItem(HERO_OPACITY_KEY);
        if (raw === null || raw === undefined || raw.trim() === '') return DEFAULT_HERO_OPACITY;
        return clampHeroOpacity(raw);
      } catch {
        return DEFAULT_HERO_OPACITY;
      }
    }

    function writeHeroOpacity(value) {
      try {
        globalThis.localStorage?.setItem(HERO_OPACITY_KEY, String(value));
      } catch {
        // A browser with storage disabled keeps the session value only.
      }
    }

    function clampAlertThreshold(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return DEFAULT_ALERT_THRESHOLD;
      return Math.max(0, Math.min(MAX_ALERT_THRESHOLD, Math.round(number * 100) / 100));
    }

    function readAlertThreshold() {
      try {
        const raw = globalThis.localStorage?.getItem(ALERT_THRESHOLD_KEY);
        if (raw === null || raw === undefined || raw.trim() === '') {
          return DEFAULT_ALERT_THRESHOLD;
        }
        return clampAlertThreshold(raw);
      } catch {
        return DEFAULT_ALERT_THRESHOLD;
      }
    }

    function writeAlertThreshold(value) {
      try {
        globalThis.localStorage?.setItem(ALERT_THRESHOLD_KEY, String(value));
      } catch {
        // A browser with storage disabled keeps the session value only.
      }
    }

    function localDateKey(date = new Date()) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}`;
    }

    function readAlertRecord() {
      try {
        const raw = globalThis.localStorage?.getItem(ALERT_RECORD_KEY);
        if (!raw) return null;
        const record = JSON.parse(raw);
        if (!record || typeof record.date !== 'string') return null;
        if (!Number.isFinite(Number(record.threshold))) return null;
        return record;
      } catch {
        return null;
      }
    }

    function writeAlertRecord(record) {
      try {
        if (record === null) {
          globalThis.localStorage?.removeItem(ALERT_RECORD_KEY);
        } else {
          globalThis.localStorage?.setItem(ALERT_RECORD_KEY, JSON.stringify(record));
        }
      } catch {
        // A browser with storage disabled keeps the session value only.
      }
    }

    function requestNotificationPermission() {
      try {
        if (typeof globalThis.Notification === 'function'
          && globalThis.Notification.permission === 'default') {
          void globalThis.Notification.requestPermission();
        }
      } catch {
        // Desktop notifications are optional; the in-app alert still works.
      }
    }

    function createBalanceStore(ctx) {
      let state = {
        phase: 'loading',
        wallets: [],
        bonusWallets: [],
        refreshing: false,
        error: false,
        updatedAt: 0,
        intervalSeconds: readIntervalSeconds(),
        alertThreshold: readAlertThreshold(),
        heroOpacity: readHeroOpacity(),
        alert: null,
        usagePhase: 'loading',
        usageCost: null,
        usageCurrency: 'CNY',
        usageError: false,
        usageUpdatedAt: 0,
      };
      const listeners = new Set();
      let generation = 0;
      let usageGeneration = 0;
      let disposed = false;
      let timer;

      const emit = (patch) => {
        state = { ...state, ...patch };
        for (const listener of listeners) listener();
      };

      const subscribe = (listener) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      };

      const getSnapshot = () => state;

      /**
       * Record one alert per local day and threshold. A dismissed alert stays
       * dismissed for that day, while the card keeps showing the over-limit state.
       */
      const maybeAlert = (cost, currency, threshold = state.alertThreshold) => {
        if (!Number.isFinite(cost) || threshold <= 0 || cost <= threshold) return;
        const date = localDateKey();
        const record = readAlertRecord();
        if (record && record.date === date && record.threshold === threshold) return;
        if (state.alert && state.alert.date === date && state.alert.threshold === threshold) return;
        const alert = { date, cost, threshold, currency, at: Date.now() };
        writeAlertRecord(alert);
        emit({ alert });
      };

      const client = () => ({
        version: CLIENT_VERSION,
        locale: ctx.locale.getSnapshot().active,
        timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
      });

      const readUsage = async () => {
        const now = new Date();
        const start = Math.floor(
          new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000,
        );
        const end = Math.floor(
          new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() / 1000,
        );
        const query = new URLSearchParams({
          start: String(start),
          end: String(end),
          tz: String(-now.getTimezoneOffset() * 60),
        });
        const response = await fetch(`${USAGE_PATH}?${query.toString()}`, {
          headers: { accept: 'application/json' },
          credentials: 'same-origin',
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('usage http failed');
        const payload = await response.json();
        if (payload?.code === 'signed-out') return { signedOut: true };
        if (!payload?.ok) throw new Error('usage read failed');
        return payload.data;
      };

      /**
       * Today's spend comes from the Host route, which owns the Platform
       * credential. It fails independently so a usage outage never hides the
       * balance.
       */
      const refreshUsage = async () => {
        if (disposed) return;
        const request = ++usageGeneration;
        emit({ usagePhase: 'loading', usageError: false });
        try {
          const data = await readUsage();
          if (disposed || request !== usageGeneration) return;
          if (data?.signedOut) {
            emit({
              usagePhase: 'signed-out',
              usageCost: null,
              alert: null,
              usageError: false,
              usageUpdatedAt: 0,
            });
            return;
          }
          const cost = Number(data?.cost);
          const currency = typeof data?.currency === 'string' && data.currency !== ''
            ? data.currency
            : 'CNY';
          emit({
            usagePhase: 'ready',
            usageCost: Number.isFinite(cost) ? cost : null,
            usageCurrency: currency,
            usageError: false,
            usageUpdatedAt: Date.now(),
          });
          if (Number.isFinite(cost)) maybeAlert(cost, currency);
        } catch {
          if (disposed || request !== usageGeneration) return;
          emit({
            usagePhase: state.usagePhase === 'ready' ? 'ready' : 'error',
            usageError: true,
          });
        }
      };

      /**
       * Read the recharge wallet once. A newer account frame or click supersedes
       * an older answer, so a slow signed-out reply can never paint over a sign-in.
       */
      const refresh = async () => {
        if (disposed) return;
        void refreshUsage();
        const request = ++generation;
        emit({ refreshing: true, error: false });
        let next;
        try {
          const result = await ctx.remote.account.getBalance(client());
          if (disposed || request !== generation) return;
          if (!result || !result.ok) throw new Error('remote refused');
          const value = result.value;
          if (value === null) {
            next = {
              phase: 'signed-out',
              wallets: [],
              bonusWallets: [],
              error: false,
              updatedAt: 0,
            };
          } else if (value.status === 'ready') {
            next = {
              phase: 'ready',
              wallets: Array.isArray(value.value) ? value.value : [],
              bonusWallets: Array.isArray(value.bonusWallets) ? value.bonusWallets : [],
              error: false,
              updatedAt: Date.now(),
            };
          } else {
            throw new Error('balance read failed');
          }
        } catch {
          if (disposed || request !== generation) return;
          next = {
            phase: state.phase === 'ready' ? 'ready' : 'error',
            error: true,
          };
          console.error('[account-balance] balance read failed');
        } finally {
          if (!disposed && request === generation) {
            emit({ ...(next ?? {}), refreshing: false });
          }
        }
      };

      const clearTimer = () => {
        if (timer === undefined) return;
        clearInterval(timer);
        timer = undefined;
      };

      const armTimer = () => {
        clearTimer();
        if (disposed || state.intervalSeconds <= 0) return;
        timer = setInterval(() => {
          if (disposed || state.refreshing) return;
          if (globalThis.document?.visibilityState === 'hidden') return;
          void refresh();
        }, state.intervalSeconds * 1000);
      };

      const setIntervalSeconds = (value) => {
        const seconds = clampIntervalSeconds(value);
        writeIntervalSeconds(seconds);
        if (seconds === state.intervalSeconds) return;
        emit({ intervalSeconds: seconds });
        armTimer();
      };

      const setAlertThreshold = (value) => {
        const threshold = clampAlertThreshold(value);
        writeAlertThreshold(threshold);
        if (threshold > 0) requestNotificationPermission();
        const cost = Number(state.usageCost);
        const over = threshold > 0
          && state.usagePhase === 'ready'
          && state.usageCost !== null
          && Number.isFinite(cost)
          && cost > threshold;
        emit({ alertThreshold: threshold, alert: over ? state.alert : null });
        if (over) maybeAlert(cost, state.usageCurrency, threshold);
      };

      const setHeroOpacity = (value) => {
        const opacity = clampHeroOpacity(value);
        writeHeroOpacity(opacity);
        if (opacity === state.heroOpacity) return;
        emit({ heroOpacity: opacity });
      };

      const stream = ctx.remote.$stream({
        name: 'account-balance',
        open: (signal) => ctx.remote.account.watch(signal),
        ended: () => new Error('account stream ended'),
      });

      ctx.effect(
        () => () => {
          disposed = true;
          generation++;
          usageGeneration++;
          clearTimer();
          stream.dispose();
        },
        'account-balance: account stream',
      );

      (async () => {
        try {
          for await (const frame of stream) {
            if (disposed) return;
            const view = frame.value?.state ?? frame.value;
            if (view && view.status === 'credential-stored') {
              // Every complete account frame gets a fresh read; sign-in, reconnect,
              // profile changes and explicit refreshes all arrive here.
              void refresh();
            } else {
              generation++;
              usageGeneration++;
              emit({
                phase: 'signed-out',
                wallets: [],
                bonusWallets: [],
                refreshing: false,
                error: false,
                updatedAt: 0,
                usagePhase: 'signed-out',
                usageCost: null,
                alert: null,
                usageError: false,
                usageUpdatedAt: 0,
              });
            }
            frame.accept();
          }
        } catch {
          if (disposed) return;
          console.error('[account-balance] account stream ended');
          if (state.phase === 'loading') emit({ phase: 'error', refreshing: false, error: true });
        }
      })();

      void refresh();
      armTimer();

      return {
        subscribe,
        getSnapshot,
        refresh: () => {
          if (!state.refreshing) void refresh();
        },
        setIntervalSeconds,
        setAlertThreshold,
        setHeroOpacity,
      };
    }

    function createUpdateStore(ctx) {
      let state = {
        status: 'idle',
        currentVersion: null,
        latestVersion: null,
        repoUrl: null,
        checkedAt: 0,
      };
      const listeners = new Set();
      let inflight;
      let lastAttempt = 0;

      const emit = (next) => {
        state = next;
        for (const listener of listeners) listener();
      };

      const subscribe = (listener) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      };

      const getSnapshot = () => state;

      const check = (force = false) => {
        if (inflight !== undefined) return inflight;
        if (!force && Date.now() - lastAttempt < UPDATE_ATTEMPT_GAP_MS) {
          return Promise.resolve(state);
        }
        lastAttempt = Date.now();
        emit({ ...state, status: 'checking' });

        inflight = (async () => {
          try {
            const response = await fetch(`${UPDATE_PATH}?force=1`, {
              headers: { accept: 'application/json' },
              credentials: 'same-origin',
              cache: 'no-store',
            });
            if (!response.ok) throw new Error('update http failed');
            const payload = await response.json();
            if (!payload?.ok || !payload.data) throw new Error('update read failed');
            const data = payload.data;
            const comparison = compareVersions(data.latestVersion, PLUGIN_VERSION);
            emit({
              status: comparison > 0 ? 'available' : comparison < 0 ? 'ahead' : 'latest',
              currentVersion: PLUGIN_VERSION,
              latestVersion: data.latestVersion ?? null,
              repoUrl: data.repoUrl ?? null,
              checkedAt: Date.now(),
            });
          } catch {
            emit({ ...state, status: 'failed', checkedAt: Date.now() });
          } finally {
            inflight = undefined;
          }
        })();

        return inflight;
      };

      ctx.effect(() => {
        void check(false);
        const timer = setInterval(() => {
          void check(false);
        }, UPDATE_CHECK_INTERVAL_MS);
        return () => clearInterval(timer);
      }, 'account-balance: update checks');

      return { subscribe, getSnapshot, check };
    }

    function createMenuStore() {
      let state = { open: false };
      const listeners = new Set();

      const emit = (next) => {
        state = next;
        for (const listener of listeners) listener();
      };

      return {
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        getSnapshot() {
          return state;
        },
        open() {
          emit({ open: true });
        },
        close() {
          if (state.open) emit({ open: false });
        },
      };
    }

    function AccountBalance({
      wide,
      t,
      subscribe,
      getSnapshot,
      refresh,
      updateSubscribe,
      updateGetSnapshot,
      openMenu,
    }) {
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
      const updateState = React.useSyncExternalStore(updateSubscribe, updateGetSnapshot);
      const phase = state.phase;
      const amount = phase === 'ready'
        ? formatWallets(state.wallets) || t('balance.empty')
        : phase === 'loading'
          ? t('balance.loading')
          : phase === 'signed-out'
            ? t('balance.signedOut')
            : t('balance.failed');
      const usageText = state.usagePhase === 'ready'
        ? formatBalance(String(state.usageCost ?? 0), symbolFor(state.usageCurrency))
        : state.usagePhase === 'loading'
          ? t('balance.loading')
          : state.usagePhase === 'signed-out'
            ? t('balance.signedOut')
            : t('balance.usageFailed');
      const alertThreshold = state.alertThreshold;
      const overAlert = state.usagePhase === 'ready'
        && alertThreshold > 0
        && state.usageCost !== null
        && Number.isFinite(Number(state.usageCost))
        && Number(state.usageCost) > alertThreshold;
      const alertLine = overAlert
        ? t('alert.over', {
            threshold: formatBalance(String(alertThreshold), symbolFor(state.usageCurrency)),
          })
        : '';
      const bonus = phase === 'ready' ? formatWallets(state.bonusWallets) : '';
      const label = t('balance.label');
      const balanceLine = phase === 'ready'
        ? `${label}: ${amount}`
        : phase === 'loading'
          ? t('balance.ariaLoading')
          : phase === 'signed-out'
            ? t('balance.signedOut')
            : t('balance.ariaFailed');
      const usageLine = `${t('balance.today')}: ${usageText}`
        + (state.usageError ? ` · ${t('balance.usageFailed')}` : '');
      const title = [
        balanceLine,
        ...(phase === 'ready' && bonus ? [`${t('balance.bonus')}: ${bonus}`] : []),
        usageLine,
        ...(overAlert ? [alertLine] : []),
        ...(state.intervalSeconds > 0
          ? [`${t('balance.autoRefresh')}: ${t('balance.everySeconds', { seconds: state.intervalSeconds })}`]
          : []),
        ...(updateState.status === 'available' && updateState.latestVersion
          ? [t('update.availableShort', { version: updateState.latestVersion })]
          : []),
        t('balance.refreshHint'),
        t('balance.contextHint'),
      ].join('\n');
      const aria = phase === 'ready'
        ? t('balance.ariaValueWithUsage', {
            amount: bonus ? `${amount} (${t('balance.bonus')}: ${bonus})` : amount,
            usage: usageText,
          })
        : phase === 'loading'
          ? t('balance.ariaLoading')
          : phase === 'signed-out'
            ? t('balance.ariaSignedOut')
            : t('balance.ariaFailed');
      const ariaLabel = overAlert ? `${aria} · ${alertLine}` : aria;

      return h(
        React.Fragment,
        null,
        h(
          'div',
          {
            className: 'ab-root',
            'data-wide': wide ? 'true' : 'false',
            style: { '--ab-hero-opacity': (state.heroOpacity / 100).toFixed(2) },
          },
          h(
            'button',
            {
              type: 'button',
              className: wide ? 'ab-button' : 'ab-button ab-railButton',
              title,
              'aria-label': ariaLabel,
              'aria-busy': state.refreshing || phase === 'loading' || state.usagePhase === 'loading'
                ? 'true'
                : undefined,
              'data-phase': phase,
              'data-refreshing': state.refreshing ? 'true' : undefined,
              onClick: () => {
                if (!state.refreshing) refresh();
              },
            },
            wide
              ? h(
                  'span',
                  { className: 'ab-copy' },
                  h(
                    'span',
                    { className: 'ab-row' },
                    h('span', { className: 'ab-label' }, label),
                    h('span', { className: 'ab-amount', 'data-phase': phase }, amount),
                  ),
                  h(
                    'span',
                    { className: 'ab-row' },
                    h('span', { className: 'ab-label' }, t('balance.today')),
                    h(
                      'span',
                      {
                        className: 'ab-usage',
                        'data-phase': state.usagePhase,
                        'data-error': state.usageError && state.usagePhase === 'ready' ? 'true' : undefined,
                        'data-over': overAlert ? 'true' : undefined,
                      },
                      h('span', { className: 'ab-usage-value' }, usageText),
                      overAlert ? h(WarningIcon, { size: 12 }) : null,
                    ),
                  ),
                )
              : h(
                  React.Fragment,
                  null,
                  h(CoinIcon, { size: 15 }),
                  h(
                    'span',
                    { className: 'ab-railAmount', 'data-phase': phase, 'aria-hidden': 'true' },
                    phase === 'ready'
                      ? formatCompactWallets(state.wallets)
                      : phase === 'loading'
                        ? '…'
                        : phase === 'signed-out'
                          ? '—'
                          : '!',
                  ),
                ),
            updateState.status === 'available'
              ? h('span', { className: 'ab-update-dot', 'aria-hidden': 'true' })
              : null,
          ),
          wide
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'ab-coinButton',
                  title: t('menu.open'),
                  'aria-label': t('menu.open'),
                  'aria-haspopup': 'dialog',
                  onClick: (event) => {
                    event.stopPropagation();
                    openMenu();
                  },
                },
                h(CoinIcon, { size: 16 }),
              )
            : null,
        ),
      );
    }

    /** Sends the optional desktop notification; the in-app warning is inline in the card. */
    function UsageAlert({ t, subscribe, getSnapshot }) {
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
      const alert = state.alert;
      const notifiedRef = React.useRef('');

      React.useEffect(() => {
        if (!alert) {
          notifiedRef.current = '';
          return;
        }
        const key = `${alert.date}:${alert.threshold}`;
        if (notifiedRef.current === key) return;
        try {
          if (typeof globalThis.Notification !== 'function'
            || globalThis.Notification.permission !== 'granted') return;
          const currency = symbolFor(alert.currency);
          const cost = formatBalance(String(alert.cost), currency);
          const threshold = formatBalance(String(alert.threshold), currency);
          new globalThis.Notification(t('alert.notificationTitle'), {
            body: t('alert.body', { cost, threshold }),
            tag: `dsh-account-balance-alert:${key}`,
          });
          notifiedRef.current = key;
        } catch {
          // Desktop notifications are optional; the inline warning still works.
        }
      }, [alert, t]);

      return null;
    }

    function BalanceMenu({
      t,
      subscribe,
      getSnapshot,
      setIntervalSeconds,
      setAlertThreshold,
      setHeroOpacity,
      menuSubscribe,
      menuGetSnapshot,
      menuClose,
      updateSubscribe,
      updateGetSnapshot,
      updateCheck,
      openPlugins,
    }) {
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
      const menu = React.useSyncExternalStore(menuSubscribe, menuGetSnapshot);
      const update = React.useSyncExternalStore(updateSubscribe, updateGetSnapshot);
      const [draft, setDraft] = React.useState(String(state.intervalSeconds));
      const [invalid, setInvalid] = React.useState(false);
      const [thresholdDraft, setThresholdDraft] = React.useState(String(state.alertThreshold));
      const [thresholdInvalid, setThresholdInvalid] = React.useState(false);
      const [opacityDraft, setOpacityDraft] = React.useState(String(state.heroOpacity));
      const [opacityInvalid, setOpacityInvalid] = React.useState(false);
      const [menuBottom, setMenuBottom] = React.useState(148);

      const alertThreshold = state.alertThreshold;
      const usageCost = Number(state.usageCost);
      const overAlert = state.usagePhase === 'ready'
        && alertThreshold > 0
        && state.usageCost !== null
        && Number.isFinite(usageCost)
        && usageCost > alertThreshold;
      const thresholdText = formatBalance(
        String(alertThreshold),
        symbolFor(state.usageCurrency),
      );

      React.useEffect(() => {
        setDraft(String(state.intervalSeconds));
        setInvalid(false);
      }, [state.intervalSeconds]);

      React.useEffect(() => {
        setThresholdDraft(String(state.alertThreshold));
        setThresholdInvalid(false);
      }, [state.alertThreshold]);

      React.useEffect(() => {
        setOpacityDraft(String(state.heroOpacity));
        setOpacityInvalid(false);
      }, [state.heroOpacity]);

      React.useEffect(() => {
        if (!menu.open) return undefined;
        void updateCheck(false);
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            menuClose();
          }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
      }, [menu.open, menuClose, updateCheck]);

      // Keep the menu's lower edge just above the card, never over the image.
      React.useEffect(() => {
        if (!menu.open) return undefined;
        const place = () => {
          const card = document.querySelector('.ab-root[data-wide="true"] .ab-button');
          const cardTop = card ? card.getBoundingClientRect().top : window.innerHeight - 132;
          const next = Math.round(Math.min(
            window.innerHeight - 12,
            Math.max(12, window.innerHeight - cardTop + 8),
          ));
          setMenuBottom(next);
        };
        place();
        window.addEventListener('resize', place);
        return () => window.removeEventListener('resize', place);
      }, [menu.open]);

      const commit = () => {
        const raw = draft.trim();
        if (raw === '') {
          setDraft(String(state.intervalSeconds));
          setInvalid(false);
          return;
        }
        const value = Number(raw);
        if (!Number.isInteger(value) || value < 0 || value > MAX_INTERVAL_SECONDS) {
          setInvalid(true);
          return;
        }
        setInvalid(false);
        setIntervalSeconds(value);
      };

      const commitAlertThreshold = () => {
        const raw = thresholdDraft.trim();
        if (raw === '') {
          setThresholdDraft(String(state.alertThreshold));
          setThresholdInvalid(false);
          return;
        }
        const value = Number(raw);
        if (!Number.isFinite(value) || value < 0 || value > MAX_ALERT_THRESHOLD) {
          setThresholdInvalid(true);
          return;
        }
        setThresholdInvalid(false);
        setAlertThreshold(value);
      };

      const commitHeroOpacity = () => {
        const raw = opacityDraft.trim();
        if (raw === '') {
          setOpacityDraft(String(state.heroOpacity));
          setOpacityInvalid(false);
          return;
        }
        const value = Number(raw);
        if (!Number.isInteger(value) || value < MIN_HERO_OPACITY || value > MAX_HERO_OPACITY) {
          setOpacityInvalid(true);
          return;
        }
        setOpacityInvalid(false);
        setHeroOpacity(value);
      };

      if (!menu.open) return null;

      let updateMessage = t('update.idle');
      let updateClass = 'ab-menu-hint';
      if (update.status === 'checking') {
        updateMessage = t('update.checking');
      } else if (update.status === 'latest') {
        updateMessage = t('update.latest', { version: update.latestVersion });
      } else if (update.status === 'available') {
        updateMessage = t('update.available', {
          latest: update.latestVersion,
          current: update.currentVersion,
        });
        updateClass += ' ab-update-available';
      } else if (update.status === 'ahead') {
        updateMessage = t('update.ahead', {
          current: update.currentVersion,
          latest: update.latestVersion,
        });
      } else if (update.status === 'failed') {
        updateMessage = t('update.failed');
        updateClass += ' ab-update-failed';
      }

      return h(
        'div',
        {
          className: 'ab-menu-layer',
          onPointerDown: menuClose,
          onContextMenu: (event) => {
            event.preventDefault();
            menuClose();
          },
        },
        h(
          'div',
          {
            className: 'ab-menu',
            style: { left: '8px', bottom: `${menuBottom}px` },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': t('menu.title'),
            onPointerDown: (event) => event.stopPropagation(),
            onContextMenu: (event) => event.preventDefault(),
          },
          h(
            'div',
            { className: 'ab-menu-header' },
            h('span', { className: 'ab-menu-title' }, t('menu.title')),
            h(
              'button',
              {
                type: 'button',
                className: 'ab-menu-close',
                'aria-label': t('menu.close'),
                onClick: menuClose,
              },
              '×',
            ),
          ),
          h(
            'div',
            { className: 'ab-menu-body' },
            h(
              'div',
              { className: 'ab-menu-row' },
              h(
                'div',
                { className: 'ab-menu-copy' },
                h('div', { className: 'ab-menu-label' }, t('settings.title')),
                h('div', { className: 'ab-menu-hint' }, t('settings.description')),
                invalid
                  ? h('div', { className: 'ab-menu-error', role: 'alert' }, t('settings.invalid'))
                  : null,
              ),
              h(
                'div',
                { className: 'ab-menu-control' },
                h('input', {
                  className: 'ab-menu-input',
                  type: 'number',
                  min: 0,
                  max: MAX_INTERVAL_SECONDS,
                  step: 1,
                  inputMode: 'numeric',
                  autoFocus: true,
                  value: draft,
                  'aria-label': t('settings.title'),
                  'aria-invalid': invalid ? 'true' : undefined,
                  onChange: (event) => {
                    setDraft(event.target.value);
                    if (invalid) setInvalid(false);
                  },
                  onBlur: commit,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commit();
                    } else if (event.key === 'Escape') {
                      event.stopPropagation();
                      setDraft(String(state.intervalSeconds));
                      setInvalid(false);
                      menuClose();
                    }
                  },
                }),
                h('span', { className: 'ab-menu-unit' }, t('settings.unit')),
              ),
            ),
            h(
              'div',
              { className: 'ab-menu-row' },
              h(
                'div',
                { className: 'ab-menu-copy' },
                h('div', { className: 'ab-menu-label' }, t('opacity.title')),
                h('div', { className: 'ab-menu-hint' }, t('opacity.description')),
                opacityInvalid
                  ? h('div', { className: 'ab-menu-error', role: 'alert' }, t('opacity.invalid'))
                  : null,
              ),
              h(
                'div',
                { className: 'ab-menu-control' },
                h('input', {
                  className: 'ab-menu-input',
                  type: 'number',
                  min: MIN_HERO_OPACITY,
                  max: MAX_HERO_OPACITY,
                  step: 1,
                  inputMode: 'numeric',
                  value: opacityDraft,
                  'aria-label': t('opacity.title'),
                  'aria-invalid': opacityInvalid ? 'true' : undefined,
                  onChange: (event) => {
                    setOpacityDraft(event.target.value);
                    if (opacityInvalid) setOpacityInvalid(false);
                  },
                  onBlur: commitHeroOpacity,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitHeroOpacity();
                    } else if (event.key === 'Escape') {
                      event.stopPropagation();
                      setOpacityDraft(String(state.heroOpacity));
                      setOpacityInvalid(false);
                      menuClose();
                    }
                  },
                }),
                h('span', { className: 'ab-menu-unit' }, '%'),
              ),
            ),
            h(
              'div',
              { className: 'ab-menu-row' },
              h(
                'div',
                { className: 'ab-menu-copy' },
                h('div', { className: 'ab-menu-label' }, t('alert.settingTitle')),
                h('div', { className: 'ab-menu-hint' }, t('alert.settingDescription')),
                thresholdInvalid
                  ? h('div', { className: 'ab-menu-error', role: 'alert' }, t('alert.invalid'))
                  : null,
                overAlert
                  ? h(
                      'div',
                      { className: 'ab-menu-warn' },
                      t('alert.over', { threshold: thresholdText }),
                    )
                  : null,
              ),
              h(
                'div',
                { className: 'ab-menu-control' },
                h('input', {
                  className: 'ab-menu-input',
                  type: 'number',
                  min: 0,
                  max: MAX_ALERT_THRESHOLD,
                  step: 0.01,
                  inputMode: 'decimal',
                  value: thresholdDraft,
                  'aria-label': t('alert.settingTitle'),
                  'aria-invalid': thresholdInvalid ? 'true' : undefined,
                  onChange: (event) => {
                    setThresholdDraft(event.target.value);
                    if (thresholdInvalid) setThresholdInvalid(false);
                  },
                  onBlur: commitAlertThreshold,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitAlertThreshold();
                    } else if (event.key === 'Escape') {
                      event.stopPropagation();
                      setThresholdDraft(String(state.alertThreshold));
                      setThresholdInvalid(false);
                      menuClose();
                    }
                  },
                }),
                h('span', { className: 'ab-menu-unit' }, t('alert.settingUnit')),
              ),
            ),
            h(
              'div',
              { className: 'ab-menu-row' },
              h(
                'div',
                { className: 'ab-menu-copy' },
                h('div', { className: 'ab-menu-label' }, t('update.title')),
                h(
                  'div',
                  {
                    className: updateClass,
                    role: update.status === 'failed' ? 'alert' : 'status',
                    'aria-live': 'polite',
                  },
                  updateMessage,
                ),
                h('div', { className: 'ab-menu-hint' }, t('update.autoCheck')),
                update.status === 'available'
                  ? h('div', { className: 'ab-menu-hint' }, t('update.hint'))
                  : null,
                update.status === 'available' && update.repoUrl
                  ? h(
                      'a',
                      {
                        className: 'ab-menu-link',
                        href: update.repoUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      },
                      t('update.open'),
                    )
                  : null,
              ),
              h(
                'div',
                { className: 'ab-menu-actions' },
                update.status === 'available' && openPlugins
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'ab-menu-button ab-menu-button-primary',
                        onClick: () => {
                          menuClose();
                          openPlugins();
                        },
                      },
                      t('update.openPlugins'),
                    )
                  : null,
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'ab-menu-button',
                    disabled: update.status === 'checking',
                    'aria-busy': update.status === 'checking' ? 'true' : undefined,
                    onClick: () => void updateCheck(true),
                  },
                  update.status === 'checking' ? t('update.checking') : t('update.check'),
                ),
              ),
            ),
          ),
          h('div', { className: 'ab-menu-footer' }, t('menu.footer')),
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout', 'remote', 'remote.account'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, { zh, en }),
          'account-balance: dictionaries',
        );
        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = '@local/dsh-account-balance';
          tag.textContent = css;
          document.head.appendChild(tag);
          return () => {
            tag.remove();
          };
        }, 'account-balance: styles');
        const store = createBalanceStore(ctx);
        const updateStore = createUpdateStore(ctx);
        const menuStore = createMenuStore();
        const pluginNavigation = ctx.get('pluginNavigation');
        const openPlugins = () => {
          try {
            if (pluginNavigation !== undefined && typeof pluginNavigation.openBundle === 'function') {
              pluginNavigation.openBundle('@local/dsh-account-balance');
              return;
            }
            ctx.layout.selectPanel('plugins');
          } catch {
            // The Plugins panel is unavailable in this composition.
          }
        };

        ctx.slots.inject(SLOT, () => ctx.slots.register(
          {
            name: SLOT,
            id: 'account-balance',
            order: 20,
            locale: NS,
            inject: () => ({
              ...store,
              updateSubscribe: updateStore.subscribe,
              updateGetSnapshot: updateStore.getSnapshot,
              openMenu: menuStore.open,
            }),
          },
          AccountBalance,
        ));

        ctx.slots.inject('shell.overlay', () => ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'account-balance-menu',
            order: 100,
            locale: NS,
            inject: () => ({
              subscribe: store.subscribe,
              getSnapshot: store.getSnapshot,
              setIntervalSeconds: store.setIntervalSeconds,
              setAlertThreshold: store.setAlertThreshold,
              setHeroOpacity: store.setHeroOpacity,
              menuSubscribe: menuStore.subscribe,
              menuGetSnapshot: menuStore.getSnapshot,
              menuClose: menuStore.close,
              updateSubscribe: updateStore.subscribe,
              updateGetSnapshot: updateStore.getSnapshot,
              updateCheck: updateStore.check,
              openPlugins,
            }),
          },
          BalanceMenu,
        ));

        ctx.slots.inject('shell.overlay', () => ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'account-balance-alert',
            order: 101,
            locale: NS,
            inject: () => ({
              subscribe: store.subscribe,
              getSnapshot: store.getSnapshot,
            }),
          },
          UsageAlert,
        ));
      },
    };
  },
});

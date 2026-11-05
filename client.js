window.__ModuleLoader__.load({
  id: '@local/dsh-account-balance',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owned by this plugin. */
    const NS = 'accountBalance';
    /** Sidebar-foot list beside Settings. */
    const SLOT = 'sidebar.footer.action';
    /** Settings page that owns the auto-refresh preference. */
    const SETTINGS_SLOT = 'settings.section';
    /** Host route that reads today's Platform spend. */
    const USAGE_PATH = '/account-balance/usage';
    /** Host route that reads this repository's published version. */
    const UPDATE_PATH = '/account-balance/update';
    /** The account Remote sends this client identity with each Platform read. */
    const CLIENT_VERSION = '0.2.1-rc.5';
    /** Browser-local preference: seconds between automatic balance reads; 0 = off. */
    const INTERVAL_KEY = 'dsh.account-balance.refresh-seconds.v1';
    const DEFAULT_INTERVAL_SECONDS = 60;
    const MAX_INTERVAL_SECONDS = 3600;

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
      'balance.aria': 'Account balance',
      'balance.ariaValue': 'Account balance: {amount}. Click to refresh.',
      'balance.ariaValueWithUsage': 'Account balance: {amount}. Today used: {usage}. Click to refresh.',
      'balance.ariaLoading': 'Account balance is loading',
      'balance.ariaSignedOut': 'Account balance unavailable: not signed in',
      'balance.ariaFailed': 'Account balance could not be read. Click to retry.',
      'settings.title': 'Auto-refresh',
      'settings.nav': 'Balance & usage',
      'settings.pageDescription': 'Controls how often the balance and today\'s spend in the sidebar card refresh.',
      'settings.description': 'Seconds between automatic balance and today\'s-spend reads; 0 turns auto-refresh off.',
      'settings.unit': 'seconds',
      'settings.invalid': 'Enter a whole number from 0 to 3600.',
      'update.title': 'Plugin update',
      'update.check': 'Check for updates',
      'update.checking': 'Checking…',
      'update.idle': 'Check GitHub for a newer release.',
      'update.latest': 'Up to date (v{version}).',
      'update.available': 'New version v{latest} is available (current v{current}).',
      'update.ahead': 'Local version v{current} is newer than GitHub v{latest}.',
      'update.failed': 'Update check failed. Try again later.',
      'update.hint': 'Uninstall the old version on the Plugins page, then install the new one.',
      'update.open': 'Open GitHub',
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
      'balance.aria': '账户余额',
      'balance.ariaValue': '账户余额：{amount}。点击刷新。',
      'balance.ariaValueWithUsage': '账户余额：{amount}。今日已用：{usage}。点击刷新。',
      'balance.ariaLoading': '正在读取账户余额',
      'balance.ariaSignedOut': '账户余额不可用：未登录',
      'balance.ariaFailed': '账户余额读取失败，点击重试',
      'settings.title': '自动刷新',
      'settings.nav': '余额与用量',
      'settings.pageDescription': '控制左下角余额卡片中余额和今日用量的刷新频率。',
      'settings.description': '自动读取余额和今日用量的间隔（秒）；0 表示关闭。',
      'settings.unit': '秒',
      'settings.invalid': '请输入 0–3600 之间的整数。',
      'update.title': '插件更新',
      'update.check': '检查更新',
      'update.checking': '检查中…',
      'update.idle': '检查 GitHub 上是否有新版本。',
      'update.latest': '已是最新版本（v{version}）。',
      'update.available': '发现新版本 v{latest}（当前 v{current}）。',
      'update.ahead': '本地版本 v{current} 比 GitHub 上的 v{latest} 新。',
      'update.failed': '检查失败，请稍后重试。',
      'update.hint': '请到 Plugins 页面卸载旧版本后重新安装。',
      'update.open': '打开 GitHub',
    };

    const css = `
.ab-root { flex: none; width: 100%; min-width: 0; }
.ab-root[data-wide="false"] { width: auto; }
.ab-button {
  box-sizing: border-box;
  width: calc(100% + 4px);
  height: 48px;
  margin: 8px -2px 0;
  padding: 0 10px 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  cursor: pointer;
  -webkit-app-region: no-drag;
}
.ab-button:hover { background: var(--dsw-alias-bg-layer-2); }
.ab-button:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}
.ab-icon { flex: none; display: block; color: var(--dsw-alias-label-secondary); }
.ab-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
}
.ab-amount {
  flex: none;
  max-width: 62%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}
.ab-usage {
  flex: none;
  max-width: 62%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}
.ab-usage[data-phase="loading"],
.ab-usage[data-phase="signed-out"] {
  color: var(--dsw-alias-label-tertiary);
}
.ab-usage[data-phase="error"] { color: var(--dsw-alias-state-error-primary); }
.ab-usage[data-error="true"] { color: var(--dsw-alias-state-warn-primary); }
.ab-amount[data-phase="loading"],
.ab-amount[data-phase="signed-out"] {
  color: var(--dsw-alias-label-tertiary);
  font-weight: 400;
}
.ab-amount[data-phase="error"] {
  color: var(--dsw-alias-state-error-primary);
  font-weight: 500;
}
.ab-button[data-phase="error"] .ab-icon { color: var(--dsw-alias-state-error-primary); }
.ab-button[data-refreshing="true"] .ab-icon { animation: ab-pulse 1s ease-in-out infinite; }
.ab-railButton {
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
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
.ab-setting-row {
  border-bottom: .5px solid var(--dsw-alias-border-l2);
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
  display: flex;
}
.ab-page { display: flex; flex-direction: column; gap: 8px; padding: 8px 0 0; }
.ab-page-intro {
  color: var(--dsw-alias-label-secondary);
  margin: 0 0 4px;
  font-size: 13px;
  line-height: 20px;
}
.ab-page > .ab-setting-row:last-child { border-bottom: none; }
.ab-setting-copy { display: flex; flex-direction: column; min-width: 0; cursor: pointer; }
.ab-setting-title { color: var(--dsw-alias-label-primary); font-size: 14px; line-height: 20px; }
.ab-setting-description {
  color: var(--dsw-alias-label-secondary);
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
}
.ab-setting-error {
  color: var(--dsw-alias-state-error-primary);
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
}
.ab-setting-control {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 22px;
}
.ab-setting-input {
  box-sizing: border-box;
  width: 76px;
  height: 32px;
  padding: 0 8px;
  border: .5px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.ab-setting-input:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.ab-setting-unit { white-space: nowrap; }
.ab-update-button {
  box-sizing: border-box;
  height: 32px;
  padding: 0 12px;
  border: .5px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.ab-update-button:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.ab-update-button:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.ab-update-button:disabled { opacity: .55; cursor: default; }
.ab-update-link {
  color: var(--dsw-alias-brand-primary);
  font-size: 12px;
  line-height: 18px;
  text-decoration: none;
  white-space: nowrap;
}
.ab-update-link:hover { text-decoration: underline; }
.ab-update-available { color: var(--dsw-alias-state-success-primary); }
.ab-update-failed { color: var(--dsw-alias-state-error-primary); }
.ab-update-copy { cursor: default; }
@keyframes ab-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) {
  .ab-button[data-refreshing="true"] .ab-icon { animation: none; }
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

    function createBalanceStore(ctx) {
      let state = {
        phase: 'loading',
        wallets: [],
        bonusWallets: [],
        refreshing: false,
        error: false,
        updatedAt: 0,
        intervalSeconds: readIntervalSeconds(),
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
              usageError: false,
              usageUpdatedAt: 0,
            });
            return;
          }
          const cost = Number(data?.cost);
          emit({
            usagePhase: 'ready',
            usageCost: Number.isFinite(cost) ? cost : null,
            usageCurrency: typeof data?.currency === 'string' && data.currency !== ''
              ? data.currency
              : 'CNY',
            usageError: false,
            usageUpdatedAt: Date.now(),
          });
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
          if (state.phase === 'signed-out') return;
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
            const view = frame.value;
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
      };
    }

    function AccountBalance({ wide, t, subscribe, getSnapshot, refresh }) {
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
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
        ...(state.intervalSeconds > 0
          ? [`${t('balance.autoRefresh')}: ${t('balance.everySeconds', { seconds: state.intervalSeconds })}`]
          : []),
        t('balance.refreshHint'),
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

      return h(
        React.Fragment,
        null,
        h(
          'div',
          { className: 'ab-root', 'data-wide': wide ? 'true' : 'false' },
          h(
            'button',
            {
              type: 'button',
              className: wide ? 'ab-button' : 'ab-button ab-railButton',
              title,
              'aria-label': aria,
              'aria-busy': state.refreshing || phase === 'loading' || state.usagePhase === 'loading'
                ? 'true'
                : undefined,
              'data-phase': phase,
              'data-refreshing': state.refreshing ? 'true' : undefined,
              onClick: () => {
                if (!state.refreshing) refresh();
              },
            },
            h(CoinIcon, { size: wide ? 16 : 15 }),
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
                      },
                      usageText,
                    ),
                  ),
                )
              : h(
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
        ),
      );
    }

    function BalanceSettingsPage({ t, subscribe, getSnapshot, setIntervalSeconds }) {
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
      const [draft, setDraft] = React.useState(String(state.intervalSeconds));
      const [invalid, setInvalid] = React.useState(false);
      const [checking, setChecking] = React.useState(false);
      const [update, setUpdate] = React.useState({ status: 'idle' });

      React.useEffect(() => {
        setDraft(String(state.intervalSeconds));
        setInvalid(false);
      }, [state.intervalSeconds]);

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

      const checkForUpdate = async () => {
        if (checking) return;
        setChecking(true);
        setUpdate({ status: 'checking' });
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
          const comparison = compareVersions(data.latestVersion, data.currentVersion);
          setUpdate({
            status: comparison > 0 ? 'available' : comparison < 0 ? 'ahead' : 'latest',
            ...data,
          });
        } catch {
          setUpdate({ status: 'failed' });
        } finally {
          setChecking(false);
        }
      };

      let updateMessage = t('update.idle');
      let updateClass = 'ab-setting-description';
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
        { className: 'ab-page' },
        h('p', { className: 'ab-page-intro' }, t('settings.pageDescription')),
        h(
          'div',
          { className: 'ab-setting-row' },
          h(
            'label',
            { className: 'ab-setting-copy', htmlFor: 'ab-refresh-seconds' },
            h('span', { className: 'ab-setting-title' }, t('settings.title')),
            h('span', { className: 'ab-setting-description' }, t('settings.description')),
            invalid
              ? h(
                  'span',
                  { id: 'ab-refresh-error', className: 'ab-setting-error', role: 'alert' },
                  t('settings.invalid'),
                )
              : null,
          ),
          h(
            'span',
            { className: 'ab-setting-control' },
            h('input', {
              id: 'ab-refresh-seconds',
              className: 'ab-setting-input',
              type: 'number',
              min: 0,
              max: MAX_INTERVAL_SECONDS,
              step: 1,
              inputMode: 'numeric',
              value: draft,
              'aria-invalid': invalid ? 'true' : undefined,
              'aria-describedby': invalid ? 'ab-refresh-error' : undefined,
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
                  setDraft(String(state.intervalSeconds));
                  setInvalid(false);
                }
              },
            }),
            h('span', { className: 'ab-setting-unit' }, t('settings.unit')),
          ),
        ),
        h(
          'div',
          { className: 'ab-setting-row' },
          h(
            'div',
            { className: 'ab-setting-copy ab-update-copy' },
            h('span', { className: 'ab-setting-title' }, t('update.title')),
            h(
              'span',
              {
                className: updateClass,
                role: update.status === 'failed' ? 'alert' : 'status',
                'aria-live': 'polite',
              },
              updateMessage,
            ),
            update.status === 'available'
              ? h('span', { className: 'ab-setting-description' }, t('update.hint'))
              : null,
          ),
          h(
            'span',
            { className: 'ab-setting-control' },
            update.status === 'available' && update.repoUrl
              ? h(
                  'a',
                  {
                    className: 'ab-update-link',
                    href: update.repoUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  t('update.open'),
                )
              : null,
            h(
              'button',
              {
                type: 'button',
                className: 'ab-update-button',
                disabled: checking,
                'aria-busy': checking ? 'true' : undefined,
                onClick: checkForUpdate,
              },
              checking ? t('update.checking') : t('update.check'),
            ),
          ),
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.account'],
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
        const t = ctx.locale.bind(NS);
        const store = createBalanceStore(ctx);
        ctx.slots.inject(SLOT, () => ctx.slots.register(
          {
            name: SLOT,
            id: 'account-balance',
            order: 20,
            locale: NS,
            inject: () => store,
          },
          AccountBalance,
        ));
        ctx.slots.inject(SETTINGS_SLOT, () => ctx.slots.register(
          {
            name: SETTINGS_SLOT,
            id: 'account-balance',
            order: 5,
            label: () => t('settings.nav'),
            locale: NS,
            inject: () => store,
          },
          BalanceSettingsPage,
        ));
      },
    };
  },
});

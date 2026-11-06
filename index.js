/**
 * Host half of the account-balance bundle.
 *
 * The Client half reads the account balance through the existing `account`
 * Remote namespace. Today's spend is not part of that namespace; the Platform
 * dashboard keeps it behind `usage/by_api_key/cost`. This Host half adds one
 * loopback-only, same-origin route that reads the current Platform session and
 * sums that endpoint's cost buckets for the requested local day. The token is
 * used in-process only and never leaves the Host.
 *
 * A second route reads this repository's published package.json so the
 * settings page can compare the installed release with GitHub.
 */

export const inject = ['deepseekAccount', 'webServer'];

const USAGE_PATH = '/account-balance/usage';
const UPDATE_PATH = '/account-balance/update';
const COST_PATH = '/api/v0/usage/by_api_key/cost';
const REPO_URL = 'https://github.com/morepray/DSH-account-balance-plugin';
const REMOTE_PACKAGE_SOURCES = [
  {
    url: 'https://api.github.com/repos/morepray/DSH-account-balance-plugin/contents/package.json?ref=main',
    github: true,
  },
  {
    url: 'https://raw.githubusercontent.com/morepray/DSH-account-balance-plugin/main/package.json',
    github: false,
  },
  {
    url: 'https://cdn.jsdelivr.net/gh/morepray/DSH-account-balance-plugin@main/package.json',
    github: false,
  },
];
const CACHE_TTL_MS = 30_000;
const REQUEST_TIMEOUT_MS = 15_000;
const UPDATE_TIMEOUT_MS = 10_000;
const MAX_WINDOW_SECONDS = 90_000;

let cache;
let updateCache;

function json(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  });
  res.end(text);
}

/** The route only answers the local Harness page, never a cross-site caller. */
function isLocalRequest(req) {
  const address = req.socket?.remoteAddress;
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false;
  const host = req.headers.host;
  if (typeof host !== 'string') return false;
  let hostUrl;
  try {
    hostUrl = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false;
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}

function readNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) return undefined;
  return number;
}

function costOf(bucket) {
  const raw = bucket?.cost !== null && typeof bucket?.cost === 'object'
    ? bucket.cost.value
    : bucket?.cost;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

async function readUsage(account, start, end, tz) {
  const key = `${start}:${end}:${tz}`;
  if (cache !== undefined && cache.key === key && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.value;
  }

  const session = await account.getPlatformSession();
  if (session === null || typeof session.token !== 'string' || session.token.length === 0) {
    return { ok: false, code: 'signed-out' };
  }

  const url = new URL(COST_PATH, session.origin);
  url.searchParams.set('start', String(start));
  url.searchParams.set('end', String(end));
  url.searchParams.set('tz', String(tz));

  let response;
  try {
    response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'x-client-platform': 'web',
        ...(session.requestHeaders ?? {}),
        'x-dsh-auth-token': session.token,
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, code: 'failed' };
  }

  if (response.status === 401 || response.status === 403) {
    return { ok: false, code: 'auth' };
  }
  if (response.status !== 200) {
    return { ok: false, code: 'failed' };
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, code: 'failed' };
  }

  if (payload?.code === 40002 || payload?.code === 40003) {
    return { ok: false, code: 'auth' };
  }
  if (payload?.code !== 0) {
    return { ok: false, code: 'failed' };
  }

  const biz = payload?.data?.biz_data;
  if (payload?.data?.biz_code !== 0 || biz === null || typeof biz !== 'object') {
    return { ok: false, code: 'failed' };
  }

  const blocks = Array.isArray(biz.data) ? biz.data : [];
  const block = blocks.find((item) => item?.currency === 'CNY') ?? blocks[0];
  if (block === undefined) {
    return {
      ok: true,
      data: { currency: 'CNY', cost: 0, start, end, fetchedAt: Date.now() },
    };
  }

  let cost = 0;
  for (const series of Array.isArray(block.series) ? block.series : []) {
    for (const bucket of Array.isArray(series?.buckets) ? series.buckets : []) {
      cost += costOf(bucket);
    }
  }

  const value = {
    ok: true,
    data: {
      currency: typeof block.currency === 'string' && block.currency !== '' ? block.currency : 'CNY',
      cost,
      start,
      end,
      fetchedAt: Date.now(),
    },
  };
  cache = { key, at: Date.now(), value };
  return value;
}

async function readUpdate(force) {
  if (!force && updateCache !== undefined && Date.now() - updateCache.at < CACHE_TTL_MS) {
    return updateCache.value;
  }

  for (const source of REMOTE_PACKAGE_SOURCES) {
    const url = new URL(source.url);
    if (!source.github) url.searchParams.set('cb', String(Date.now()));
    let response;
    try {
      response = await fetch(url, {
        headers: {
          accept: source.github ? 'application/vnd.github+json' : 'application/json',
          'cache-control': 'no-cache',
          'user-agent': 'DSH-account-balance-plugin',
        },
        redirect: 'manual',
        signal: AbortSignal.timeout(UPDATE_TIMEOUT_MS),
      });
    } catch {
      continue;
    }
    if (response.status !== 200) continue;

    let remote;
    try {
      if (source.github) {
        const body = await response.json();
        if (body?.encoding !== 'base64' || typeof body.content !== 'string') continue;
        const text = Buffer.from(body.content.replace(/\s+/g, ''), 'base64').toString('utf8');
        remote = JSON.parse(text);
      } else {
        remote = await response.json();
      }
    } catch {
      continue;
    }
    if (typeof remote?.version !== 'string' || remote.version === '') continue;

    const value = {
      ok: true,
      data: {
        latestVersion: remote.version,
        repoUrl: REPO_URL,
        checkedAt: Date.now(),
      },
    };
    updateCache = { at: Date.now(), value };
    return value;
  }

  return { ok: false, code: 'network' };
}

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'exact',
      path: UPDATE_PATH,
      handler: async (req, res) => {
        if (!isLocalRequest(req)) {
          json(res, 403, { ok: false, code: 'forbidden' });
          return;
        }
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, code: 'method' });
          return;
        }
        let force = false;
        try {
          force = new URL(req.url ?? '/', 'http://local').searchParams.get('force') === '1';
        } catch {
          force = false;
        }
        try {
          json(res, 200, await readUpdate(force));
        } catch {
          console.error('[account-balance] update check failed');
          json(res, 200, { ok: false, code: 'failed' });
        }
      },
    }),
    'account-balance: update route',
  );

  ctx.effect(
    () => ctx.webServer.register({
      kind: 'exact',
      path: USAGE_PATH,
      handler: async (req, res) => {
        if (!isLocalRequest(req)) {
          json(res, 403, { ok: false, code: 'forbidden' });
          return;
        }
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, code: 'method' });
          return;
        }

        let query;
        try {
          query = new URL(req.url ?? '/', 'http://local').searchParams;
        } catch {
          json(res, 400, { ok: false, code: 'invalid' });
          return;
        }
        const start = readNumber(query.get('start'), 0, 4_102_444_800);
        const end = readNumber(query.get('end'), 1, 4_102_444_800);
        const tz = readNumber(query.get('tz'), -86_400, 86_400);
        if (
          start === undefined || end === undefined || tz === undefined
          || end <= start || end - start > MAX_WINDOW_SECONDS
        ) {
          json(res, 400, { ok: false, code: 'invalid' });
          return;
        }

        try {
          const value = await readUsage(ctx.deepseekAccount, start, end, tz);
          json(res, 200, value);
        } catch {
          console.error('[account-balance] usage read failed');
          json(res, 200, { ok: false, code: 'failed' });
        }
      },
    }),
    'account-balance: usage route',
  );
}

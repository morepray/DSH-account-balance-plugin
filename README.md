# DSH 余额与用量

在 DeepSeek Harness 左侧栏底部显示：

- **账户余额**
- **今日已用金额**（按本地时区 00:00 起算）
- 自动刷新间隔可配置（默认 60 秒，0 表示关闭）

点击左下角的余额卡片可以立即刷新。展开侧栏时显示两行；收起侧栏时显示硬币和余额，悬停提示中包含今日已用。

## 环境要求

- DeepSeek Harness（Desktop 或 Web）
- 已在 DSH 中登录 **DeepSeek 账户**
  - 仅配置 API Key 时，Platform 账户余额和用量不可用
- 本插件在 `0.2.1-rc.5` 上验证通过；其他版本未做兼容性保证

## 安装方式一：GitHub（推荐）

1. 在 GitHub 新建一个空仓库。
2. 把本目录中的**所有文件**放到仓库根目录。仓库根目录下必须直接看到 `package.json`，不要再多套一层 `account-balance/` 目录。
3. 提交并推送：

```bash
git init
git add .
git commit -m "feat: DSH account balance plugin"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

如果本机没有 Git，也可以在 GitHub 新建仓库后使用网页的 **Add file → Upload files**，把本目录所有文件上传到仓库根目录。

> 本插件要求 `package.json` 在仓库根目录。若放在 monorepo 的子目录，安装 spec 需要额外的 `path` 参数，建议直接使用独立仓库。

4. 在另一台电脑打开 DSH，进入左侧栏 **Plugins** → **Add plugin** → **Install a third-party plugin**，粘贴：

```text
github:<你的用户名>/<仓库名>#<完整 commit SHA>
```

建议固定到某个 commit，避免以后仓库更新导致安装内容变化。也可以粘贴完整的 GitHub 仓库 URL。目标电脑需要能访问 GitHub，并安装 Git（Plugin Manager 会先用 `git ls-remote` 检查仓库）。

5. 安装完成后重启 DSH。

命令行方式（需要 `dsh` 在 PATH 中）：

```powershell
dsh plugin --profile desktop add github:<你的用户名>/<仓库名>#<完整 commit SHA>
```

Web 版把 `desktop` 换成 `web`。

## 安装方式二：复制本地文件夹

如果不想用 GitHub：

1. 把整个 `account-balance` 文件夹复制到另一台电脑，例如 `D:\dsh-plugins\account-balance`。
2. 在 DSH 的 **Plugins** → **Add plugin** 中粘贴这个**绝对路径**：

```text
D:\dsh-plugins\account-balance
```

3. 或使用命令行：

```powershell
dsh plugin --profile desktop add link:"D:\dsh-plugins\account-balance"
```

4. 安装后重启 DSH。

## 使用

安装并重启后：

- 左下角会显示余额和今日已用
- 打开 **设置 → 余额与用量** 可修改自动刷新间隔
- 输入 `0` 关闭自动刷新
- 点击余额卡片可手动刷新

## 检查更新

打开 **设置 → 余额与用量**，在“插件更新”一行点击 **检查更新**。

- 插件会读取 GitHub `main` 分支上的 `package.json`，与当前安装版本比较
- 只做提示，不会自动覆盖安装
- 发现新版本时，会显示版本号和 GitHub 链接；到 **Plugins** 页面卸载旧版本后重新安装即可
- 更新插件时请同步修改 `package.json` 的 `version`，否则检查会认为已是最新

## 更新

GitHub 安装的版本更新时：

1. 修改 `package.json` 的 `version`，在 GitHub 推送新的 commit；
2. 在 DSH 的 **设置 → 余额与用量** 点击 **检查更新** 确认版本；
3. 在 **Plugins** 页面找到旧版本并卸载；
4. 用新的完整 commit SHA 重新安装；
5. 重启 DSH。

本插件的客户端代码没有构建步骤，重新安装或重启后会加载新文件。

## 数据与隐私

- 余额通过 DSH 现有的 `account` Remote 读取。
- 今日已用由 Host 侧路由 `/account-balance/usage` 读取 Platform 用量接口，使用当前 DeepSeek 账户登录态；token 只在 Host 进程内使用，不进入浏览器。
- 该路由只接受本机回环、同源请求。
- “检查更新”只读取本仓库公开的 `package.json`，不发送账户凭据。
- 所有读取都是只读查询，**不会扣除余额**；只有实际调用模型才会产生费用。

## 已知限制

- 今日已用使用 Platform 的私有 `usage/by_api_key/cost` 接口，Platform 改版后可能失效。
- 今日口径按浏览器本地时区 00:00 起算。
- 自动刷新会增加少量网络请求；可在设置中调大间隔或设为 0。
- 仅配置 API Key、没有登录 DeepSeek 账户时，会显示“未登录”或读取失败。

## 开发

本插件没有构建步骤，纯 JavaScript 文件：

- `index.js`：Host 半部分，登记用量和检查更新路由
- `client.js`：侧栏卡片、设置页和定时刷新
- `cordis.patch.yml`：bundle 的插件行
- `locale/*.json`：插件管理页显示元数据
- `icon.svg`：插件图标

本地修改后，在 DSH 中重新安装或重启即可生效。

## 许可证

本仓库暂未附带许可证。若要公开发布，建议在 GitHub 上补充一个 `LICENSE`（例如 MIT），并写明版权人。

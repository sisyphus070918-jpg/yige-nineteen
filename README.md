# 宜格的十九岁

给吕宜格的 19 岁生日礼物，生日是 **2026 年 11 月 2 日**。

独立静态网页，无需安装依赖或运行构建。包含入场封面、可互动的生日星球、生日信、许愿星星、生日烛光、原创生日短片，以及 21 张明星照片收藏。页面以电脑大屏效果为主。

## 直接打开

发布到 GitHub Pages 后，收礼人只需打开 Pages 网站地址，不需要下载代码、注册账号或安装软件。

本地查看：下载整个仓库并解压，用 Edge、Chrome 或 Safari 打开 `index.html`。请保留 `assets` 文件夹和所有脚本、样式文件。

## GitHub Pages 发布

仓库 Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save。

仓库根目录已包含 `.nojekyll`，所有资源使用相对路径，可直接部署到静态网站托管服务。

## 文件

- `index.html`：生日页面与对话框。
- `style.css`、`experience.css`、`gallery.css`：页面、入场和照片册样式。
- `app.js`、`experience.js`、`gallery.js`：生日礼物交互。
- `core.js`：愿望在本地浏览器中的保存逻辑。
- `photo-data.js`：照片清单及出处。
- `assets/`：视频、配乐和图片。

愿望只保存在访问者自己的浏览器中，不会上传到服务器。

## 授权和素材

本项目原创 HTML、CSS、JavaScript 代码按 MIT 许可证开放。明星照片的权利归各自权利人所有，**不属于 MIT 开源授权范围**。照片出处、原图链接和日期保存在 `assets/stars/sources.json`，并在照片册中展示。

本网页是朋友间制作的生日礼物，与页面提及的艺人、品牌或机构无官方关联。文字祝福由制作者创作，不是艺人本人寄语。

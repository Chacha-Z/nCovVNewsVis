这是ChinaVis2020数据可视分析挑战赛，四川大学（温啸林、张馨艺、张铭洋、李长林、刘尚松、朱敏）队伍的作品《基于微博数据的疫情演化可视分析系统》，该作品获挑战赛优秀奖。

比赛官网链接：http://chinavis.org/2020/challenge.html



## 作品简介

新型冠状病毒短短几个月时间内在全国扩散，给公共秩序及社会局势带来严重影响，央视新闻作为权威发言者在国内社交媒体平台新浪微博上实时推送相关新闻报道。微博报道数据量繁多，内容繁
杂，很难直观看出新冠事件及相关话题讨论随时间变化的发展动向，公众对不同话题持有的态度也难以明确。

本系统选取微博数据，从新冠疫情事件演化、话题演化和话题舆情三方面进行分析。首先结合实时疫情数据根据时间顺序构建事件相关话题的序列，准确完整地获取事件在不同阶段的特性，有助于
用户了解新冠疫情事件的前因后果和发展趋势，了解事态的严重程度，掌握新冠事件演化规律，得出事件发展过程中的重要拐点；然后对事件涉及的相关话题分析，帮助用户认识话题类型和话题热度的
时序变化；最后对每条具体的微博话题进行舆情分析，有助于用户了解公众对此话题的情绪偏向和具体态度。

## 数据介绍
数据来源于新浪微博里央视新闻博主的推文及评论。我们通过 Python 爬虫技术对微博数据进行爬取和搜集，利用 Requests 库对微博手机版和电脑版的网页 API 进行 HTTP 请求获得相应的返回内容，
使用正则表达式或 JSON 解析对不同格式的返回内容进行有效数据提取，并保存至本地以供数据的清洗、处理和格式化。

在数据清洗上，对于博客方面，我们对微博中已删除的或无法正常访问的微博数据进行删除（主页列表存在该微博，但详情无法正常访问）；对于评论方面，我们将评论内容和发布者进行关联后利
用唯一性原则进行去重，清洗掉同一个人对于同一篇博文的多条相同的评论，这在我们的分析里不具有实际意义。除此之外，我们前期简要分析了微博各大博主对于疫情动态的新闻发布，对比之后选取
了央视新闻作为我们的数据来源对象，该官方认证账号既能保持新闻动态地及时获取，也能保证新闻的真实性和公正性，同时也是我们数据严谨性的重要保障。

## 分析任务
事件演变以及话题演变有许多需要挖掘的模式。为了更好地探寻疫情微博数据集的信息，经过讨论与分析，结合数据集的特点，本系统提出了如下的可视化任务:

T1.事件演变分析：基于微博用户央视新闻的权威报道数据，结合实时疫情数据，对新冠事件从 1 月 1 日至 5 月 17 日的趋势演变进行分析，探究此事件整体的时序变化以及不同时间段的特性。通过
分析整体到具体时刻事件趋势的变化，帮助用户了解新冠疫情事件的发展趋势和演化特性。

* T1.1 事件整体演变趋势分析
* T1.2 分层次探究分析事件演变
* T1.3 结合疫情数据分析探究事件演变规律

T2.话题分析：新冠事件由大量话题组成，将所有相关话题打标签分类，探究不同类型的话题整体演变趋势和规律特性。通过分析整体到具体时刻话题热度趋势的变化，帮助用户了解话题的发展趋势
和演化特性。

* T2.1 话题整体演化趋势分析
* T2.2 分层次探究分析话题类型演变
* T2.3 分层次探究分析微博话题热度

T3.话题舆情分析：每条微博话题的评论反映公众态度，分析此数据帮助用户掌握公众整体情绪偏向和具体的态度。

* T3.1 不同情绪占比分析
* T3.2 公众态度关键词分

## 作品技术栈
* D3.js
* ECharts
* React
* MongoDB
* Koa2

## 可视化与交互设计
![image](https://user-images.githubusercontent.com/29750316/154600864-4fe22cef-5e14-4494-90d9-422e9a1981cc.png)

## 运行

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

#### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

#### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

#### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

#### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

#### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

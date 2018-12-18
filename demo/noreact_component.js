// 最简单的nextjs
// export default () => <div>Welcome to next.js!
//     <img src="/static/img/snow.png"/>
//     <style>{`
//         div {
//             background: yellowgreen;
//         }
//     `}</style>
// </div>

import fetch from 'isomorphic-unfetch'
// 无生命周期写法
const Page = ({ stars }) =>
    <div>
        Next stars: {stars}
    </div>

Page.getInitialProps = async ({ req }) => {
    const res = await fetch('https://api.github.com/repos/zeit/next.js')
    const json = await res.json()
    return { stars: json.stargazers_count }
}

export default Page
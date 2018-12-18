export default () => (
    <div>
        Hello world
        {/* 行内样式写法 */}
        <p style={{"fontSize": "35px"}}>scoped!</p>
        {/* 默认局部样式 */}
        <style jsx>{`
            p {
                color: blue;
            }
            div {
                background: red;
            }
            @media (max-width: 600px) {
                div {
                    background: blue;
                }
            }
        `}</style>
        {/* 全局样式添加global */}
        <style global jsx>{`
            body {
                background: black;
            }
        `}</style>
    </div>
)
import React from "react";
import HeaderNav from './HeaderNav';

class Page extends React.Component {
    render() {
        return (
            <div >
                <HeaderNav />
                <h1> Welcome</h1>
            </div>
        )
    }
}

export default Page;
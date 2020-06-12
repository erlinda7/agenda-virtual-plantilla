import React from "react";
import HeaderNav from './HeaderNav';
import Carrusel from "./Carrusel";
import FooterHome from "./FooterHome";

class Page extends React.Component {
    render() {
        return (
            <div  >
                <HeaderNav />
                <Carrusel />
                <FooterHome />

            </div>
        )
    }
}

export default Page;
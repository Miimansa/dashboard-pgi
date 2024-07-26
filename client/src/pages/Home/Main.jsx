import React from "react";
import Styles from './Main.module.css';
import { Link, Outlet } from "react-router-dom";
import Logo_mim from '../../assets/Miimansa_logo.png'
const Main = () => {
    return (
        <> <div className={Styles.main}>
            <div className={Styles.cont}>
                <div className={Styles.left}></div>
                <div className={Styles.right}>
                    <Outlet />
                </div>
            </div >
            <Link className={Styles.llink} to={"https://www.miimansa.com/"} target="blank">
                <div className={Styles.poweredbydiv}>
                    <p>Powered By</p>
                    <img src={Logo_mim} alt="LOGO"></img>

                </div>
            </Link>
        </div>
        </>
    );
}

export default Main;

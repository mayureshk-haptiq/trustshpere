import React from "react";
import '../styles/index.css';

export default function Footer() {

    const currYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <p className="footer-text">
                &copy; {currYear} TrustSphere, All Rights Reserved.
            </p>
        </footer>
    );
}
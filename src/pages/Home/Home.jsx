import React from 'react';
import './Home.css';
import banner from '../../assets/home.jpeg'
import about from '../../assets/about.webp'
import mission from '../../assets/mission.webp'
import vision from '../../assets/vision.jpg'

const Home = () => {
    return (
        <div className="home-container">

            <div className="banner">
                <img 
                    src={banner}
                    alt="Banner"
                    className="banner-img"
                />
            </div>

            <section className="section">
                <div className="section-content">
                    <img 
                        src={about}
                        alt="About Us"
                        className="section-img"
                    />
                    <div>
                        <h2>About Us</h2>
                        <p>
                            Market Pulse Tracker is a digital platform designed to ensure fair, 
                            accurate, and transparent market pricing for everyday consumers. 
                            In many local markets, price manipulation, misinformation, and 
                            syndicates create artificial inflation—hurting both honest sellers 
                            and buyers.
                            <br /><br />
                            Our system solves this by allowing Admins to set verified product 
                            price ranges, Sellers to upload products honestly, and Buyers to 
                            view real-time, location-based prices.
                            <br /><br />
                            We empower communities with truthful data, protect buyers from 
                            overpricing, and help sellers maintain integrity. Market Pulse 
                            Tracker is built to promote fairness, transparency, and trust in 
                            the local marketplace.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section alt">
                <div className="section-content">
                    <div>
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to ensure honest market pricing by providing a 
                            platform where buyers can easily access real, verified product 
                            prices, sellers follow a transparent price-guideline system, and 
                            admins monitor and prevent unfair price manipulation.
                            <br /><br />
                            We aim to protect communities from syndicates and artificial price 
                            hikes while building a fair, reliable, and corruption-free market 
                            system that supports better decision-making for every local shopper.
                        </p>
                    </div>
                    <img 
                        src={mission}
                        alt="Mission"
                        className="section-img"
                    />
                </div>
            </section>

            <section className="section">
                <div className="section-content">
                    <img 
                        src={vision} 
                        alt="Vision"
                        className="section-img"
                    />
                    <div>
                        <h2>Our Vision</h2>
                        <p>
                            We envision a future where every consumer can check real-time 
                            market prices from anywhere, no seller can mislead or overcharge 
                            customers, and syndicates lose control over local pricing.
                            <br /><br />
                            Through technology, we aim to ensure fairness, honesty, and equal 
                            access to information—building marketplaces that are transparent, 
                            trust-driven, and economically empowering.
                            <br /><br />
                            Market Pulse Tracker strives to become the most trusted price 
                            transparency platform for local markets.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                © {new Date().getFullYear()} Market Pulse Tracker. All rights reserved.
            </footer>

        </div>
    );
};

export default Home;

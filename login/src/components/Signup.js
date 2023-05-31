import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Signup() {
    const history = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();

        try {

            await axios.post("http://localhost:8000/signup", {
                email, password
            })
                .then(res => {
                    if (res.data == "exist") {
                        alert("User already exists")
                    }
                    else if (res.data == "notexist") {
                        history("/home", { state: { id: email } })
                    }
                })
                .catch(e => {
                    alert("wrong details")
                    console.log(e);
                })

        }
        catch (e) {
            console.log(e);

        }

    }


    return (
        <div>
            <div className="app-bar">
                <img src={logo} alt="Logo" className="logo" />
                <h1 className="app-title">Alertas Uruguay</h1>
            </div>
            <div className="signup-form">
                <h2>Registrarse</h2>
                <form action="POST" >
                    <input
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="Password"
                    />
                    <input type="submit" value="Listo!" onClick={submit} />
                </form>

                <br />
                <p>OR</p>
                <br />

                <Link to="/">Ingresar</Link>
            </div>
        </div>


    )
}

export default Signup
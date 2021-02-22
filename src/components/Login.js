import React, {useState} from "react";

const Login = ({
    onLogin,
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onLogin}>
                <div>
                    username
                    <input name="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div>
                    password
                    <input name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    );
};

export default Login;

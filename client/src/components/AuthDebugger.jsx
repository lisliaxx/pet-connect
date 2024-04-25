import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext.js"; 

export default function AuthDebugger() {
    const { user } = useAuth0();
    const token = useAuthToken();

    return (
        <div>
        <div>
            <h1>Auth Debugger</h1>
        </div>
        <div>
            <p>User Info</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <p>Token</p>
            <pre>{JSON.stringify(token, null, 2)}</pre>
        </div>
    </div>
    );
}
